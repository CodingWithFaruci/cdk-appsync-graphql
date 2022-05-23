import { ICdkAppsyncGraphqlStackProps } from './stack-environment-types';

const devEnvironmentConfig: ICdkAppsyncGraphqlStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkAppsyncGraphql',
  },
  imports: {
    kmsKeyArn: 'arn:aws:kms:eu-west:00000000:key/00000000',
    certArn: 'arn:aws:kms:eu-west:00000000:key/00000000',
    cognitoPoolId: 'id',
    dynamoTableName: 'name',
  },
  environment: 'dev',
  appsyncDomainName: 'api.pocketbattlesar.com',
  apikeyExpireDuration: 365,
  lambdaMemory: 128,
  lambdaTimeout: 30,
};

export default devEnvironmentConfig;