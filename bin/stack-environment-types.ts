import { StackProps } from 'aws-cdk-lib';

export interface ICdkAppsyncGraphqlStackProps extends StackProps {
  environment: string,
  imports: {
    kmsKeyArn: string,
    cognitoPoolId: string,
    dynamoTableName: string,
    certArn: string,
  }
  apikeyExpireDuration: number,
  lambdaMemory: number,
  lambdaTimeout: number,
  appsyncDomainName: string,
}