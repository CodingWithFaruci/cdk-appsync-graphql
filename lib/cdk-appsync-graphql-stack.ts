import { Aws, Duration, Expiration, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cert from 'aws-cdk-lib/aws-certificatemanager';
import * as sqs from 'aws-cdk-lib/aws-sqs';

// extended stack environment props
import { ICdkAppsyncGraphqlStackProps } from '../bin/stack-environment-types';
import { REQUEST_TEMPLATE, RESPONSE_TEMPLATE } from './sqs-config';

export class CdkAppsyncGraphqlStack extends Stack {
  constructor(scope: Construct, id: string, props: ICdkAppsyncGraphqlStackProps) {
    super(scope, id, props);

    /**
     * @key Importing existing kms key for granting resolver encrypt/decrypt rights.
     */
    const key = kms.Key.fromKeyArn(
      this,
      'key',
      props.imports.kmsKeyArn,
    );

    /**
     * @userPool Importing existing cognito userpool, for authorization on appsync graphql api.
     */
    const userPool = cognito.UserPool.fromUserPoolId(
      this,
      'userpool',
      props.imports.cognitoPoolId,
    );

    /**
     * @table Importing existing dynamodb table as datasource for appsync graphql api.
     */
    const table = dynamodb.Table.fromTableName(
      this,
      'table',
      props.imports.dynamoTableName,
    );

    /**
     * @GraphqlApi Creating appsync graphql api with default api-key authorization and additional cognito authorisation.
     */
    const appsyncApi = new appsync.GraphqlApi(
      this,
      'appsync-api',
      {
        domainName: {
          domainName: props.appsyncDomainName,
          certificate: cert.Certificate.fromCertificateArn(this, 'cert', props.imports.certArn),
        },
        name: `appsync-api-${props.environment}`,
        schema: appsync.Schema.fromAsset('./graphql/schema.graphql'),
        logConfig: {
          fieldLogLevel: appsync.FieldLogLevel.ALL,
        },
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              name: `appsync-api-key-${props.environment}`,
              description: 'Public api key for appsync api',
              expires: Expiration.after(Duration.days(props.apikeyExpireDuration)),
            },
          },
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.USER_POOL,
              userPoolConfig: {
                userPool,
              },
            },
          ],
        },
      });

    /**
     * @resolverLambda Creating lambda function for resolving appsync graphql api calls.
     */
    const resolverLambda = new lambda.Function(this, 'lambda-appsync-resolver', {
      functionName: `lambda-appsync-resolver-${props.environment}`,
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('dist'),
      handler: 'index.handler',
      memorySize: props.lambdaMemory,
      timeout: Duration.seconds(props.lambdaTimeout),
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    // adding permissions to resolver lambda
    key.grantEncryptDecrypt(resolverLambda);
    table.grantReadWriteData(resolverLambda);

    // adding resolver lambda as datasource to appsync graphql api.
    const lambdaResolverDataSource = appsyncApi.addLambdaDataSource(
      'lambda-resolver-datasource',
      resolverLambda,
      {
        name: `appsync-datasource-${props.environment}`,
        description: 'Adds lambda resolver as datasource for appsync graphql api',
      },
    );

    // adding resolvers for datasource
    lambdaResolverDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'Account',
    });

    const resolverSqs = new sqs.Queue(this, 'sqs-appsync-resolver', {
      queueName: `sqs-appsync-resolver-${props.environment}`,
    });

    // adding resolver sqs as datasource to appsync graphql api.
    const sqsResolverDataSource = appsyncApi.addHttpDataSource('sqs-resolver-datasource', `https://sqs.${Aws.REGION}.amazonaws.com`, {
      authorizationConfig: { signingRegion: Aws.REGION, signingServiceName: 'sqs' },
    });
    resolverSqs.grantSendMessages(sqsResolverDataSource);

    // adding resolvers for datasource
    sqsResolverDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'Account',
      requestMappingTemplate: appsync.MappingTemplate.fromString(REQUEST_TEMPLATE(Aws.ACCOUNT_ID, resolverSqs)),
      responseMappingTemplate: appsync.MappingTemplate.fromString(RESPONSE_TEMPLATE),
    });
  }
}
