import { ICdkAppsyncGraphqlStackProps } from './stack-environment-types';

const tstEnvironmentConfig: ICdkAppsyncGraphqlStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkAppsyncGraphql',
  },
  environment: 'tst',
};

export default tstEnvironmentConfig;