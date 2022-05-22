import { ICdkAppsyncGraphqlStackProps } from './stack-environment-types';

const prdEnvironmentConfig: ICdkAppsyncGraphqlStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkAppsyncGraphql',
  },
  environment: 'prd',
};

export default prdEnvironmentConfig;