export const Logger = {
  error: jest.fn(),
  write: jest.fn(),
  log: jest.fn(),
  activeLogLevel: 0,
  subscribe: jest.fn(),
};
