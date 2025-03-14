/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  maxWorkers: 4,
  silent: true,
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.test.json' },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testRegex: 'src/tests/.*\\.test.(ts?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '@microsoft/sp-webpart-base': 'identity-obj-proxy',
    '@microsoft/sp-core-library': 'identity-obj-proxy',
    '@microsoft/sp-application-base': 'identity-obj-proxy',
    'office-ui-fabric-react/lib/(.*)$':
      'office-ui-fabric-react/lib-commonjs/$1',
    '^@pnp/(.*)$': 'identity-obj-proxy',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
};
