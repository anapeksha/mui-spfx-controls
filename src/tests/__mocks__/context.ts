import { WebPartContext } from '@microsoft/sp-webpart-base';

export const mockContext = {
  pageContext: {
    web: {
      absoluteUrl: 'https://contoso.sharepoint.com/sites/mocksite',
      title: 'Mock Site',
      id: 'web-guid-1234',
    },
    site: {
      absoluteUrl: 'https://contoso.sharepoint.com',
      id: 'site-guid-5678',
    },
    user: {
      displayName: 'John Doe',
      email: 'johndoe@contoso.com',
      loginName: 'i:0#.f|membership|johndoe@contoso.com',
    },
  },
  spHttpClient: {
    get: jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    }),
    post: jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    }),
  },
  msGraphClientFactory: {
    getClient: jest.fn().mockResolvedValue({
      api: jest.fn().mockReturnThis(),
      version: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      filter: jest.fn().mockReturnThis(),
      top: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ value: [] }),
      post: jest.fn().mockResolvedValue({}),
    }),
  },
  serviceScope: {
    whenFinished: jest.fn((callback) => callback()),
  },
} as unknown as WebPartContext;
