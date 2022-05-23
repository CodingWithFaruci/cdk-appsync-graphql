import { ICdkAppsyncGraphqlStackProps } from './stack-environment-types';

const tstEnvironmentConfig: ICdkAppsyncGraphqlStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkAppsyncGraphql',
  },
  imports: {
    kmsKeyArn: 'arn:aws:kms:eu-west:00000000:key/00000000',
    cognitoPoolId: 'id',
    dynamoTableName: 'name',
    certArn: 'arn:aws:kms:eu-west:00000000:key/00000000',
  },
  environment: 'tst',
  apikeyExpireDuration: 365,
  lambdaMemory: 128,
  lambdaTimeout: 30,
  appsyncDomainName: 'api.pocketbattlesar.com',
};

export default tstEnvironmentConfig;