import { Duration, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

// extended stack environment props
import { ICdkAppsyncGraphqlStackProps } from '../bin/stack-environment-types';

export class CdkAppsyncGraphqlStack extends Stack {
  constructor(scope: Construct, id: string, props: ICdkAppsyncGraphqlStackProps) {
    super(scope, id, props);

    // example resource
    new sqs.Queue(this, 'Queue', {
      queueName: 'testName',
      visibilityTimeout: Duration.seconds(300),
    });
  }
}
