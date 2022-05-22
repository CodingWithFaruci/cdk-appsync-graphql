#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkAppsyncGraphqlStack } from '../lib/cdk-appsync-graphql-stack';

// importing configuration based on environment
import devEnvironmentConfig from './dev-stack-config';
import tstEnvironmentConfig from './tst-stack-config';
import prdEnvironmentConfig from './prd-stack-config';

const app = new cdk.App();

// injecting configurations into stack based on environment.
new CdkAppsyncGraphqlStack(app, 'cdk-appsync-graphql-dev', devEnvironmentConfig);
new CdkAppsyncGraphqlStack(app, 'cdk-appsync-graphql-tst', tstEnvironmentConfig);
new CdkAppsyncGraphqlStack(app, 'cdk-appsync-graphql-prd', prdEnvironmentConfig);