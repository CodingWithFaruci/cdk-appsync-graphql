import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import devEnvironmentConfig from '../bin/dev-stack-config';
import * as Stack from '../lib/cdk-appsync-graphql-stack';

const app = new cdk.App();
const stack = new Stack.CdkAppsyncGraphqlStack(app, 'MyTestStack', devEnvironmentConfig);
const template = Template.fromStack(stack);

test('AppSync', () => {
  template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
    Name: 'appsync-api-dev',
    AuthenticationType: 'API_KEY',
    AdditionalAuthenticationProviders: [
      {
        AuthenticationType: 'AMAZON_COGNITO_USER_POOLS',
        UserPoolConfig: {
          UserPoolId: 'id',
        },
      },
    ],
    LogConfig: {
      FieldLogLevel: 'ALL',
    },
  });
});

test('AppSync DataSource', () => {
  template.hasResourceProperties('AWS::AppSync::DataSource', {
    Name: 'appsyncdatasourcedev',
    Type: 'AWS_LAMBDA',
    Description: 'Adds lambda resolver as datasource for appsync graphql api',
  });
});

test('Lambda', () => {
  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: 'lambda-appsync-resolver-dev',
    Handler: 'index.handler',
    MemorySize: 128,
    Runtime: 'nodejs16.x',
    Timeout: 30,
  });
});
