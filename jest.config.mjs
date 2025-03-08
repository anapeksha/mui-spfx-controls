export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  moduleNameMapper: {
    '^office-ui-fabric-react/lib/(.*)$':
      'office-ui-fabric-react/lib-commonjs/$1',
    '^@microsoft/sp-(.*)$': '@microsoft/sp-$1/lib-commonjs',
  },
};
