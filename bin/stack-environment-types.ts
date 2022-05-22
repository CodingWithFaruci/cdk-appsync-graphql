import { StackProps } from 'aws-cdk-lib';

export interface ICdkAppsyncGraphqlStackProps extends StackProps {
  environment: string
}