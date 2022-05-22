import { ICdkAppsyncGraphqlStackProps } from './stack-environment-types';

const devEnvironmentConfig: ICdkAppsyncGraphqlStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkAppsyncGraphql',
  },
  environment: 'dev',
};

export default devEnvironmentConfig;