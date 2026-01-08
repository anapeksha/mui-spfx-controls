import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * Mock SPFI instance for testing
 */
const mockSPFI: any = {
  web: {
    lists: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockReturnValue({
      getCurrentUserEffectivePermissions: jest.fn().mockResolvedValue({}),
      items: {
        getById: jest.fn().mockReturnValue({
          recycle: jest.fn().mockResolvedValue(undefined),
          update: jest.fn().mockResolvedValue(undefined),
        }),
        add: jest.fn().mockResolvedValue({}),
        select: jest.fn().mockReturnThis(),
        expand: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        top: jest.fn().mockResolvedValue([]),
      },
      fields: jest.fn().mockResolvedValue([]),
      select: jest.fn().mockReturnThis(),
      hasPermissions: jest.fn().mockReturnValue(true),
    }),
    getFolderByServerRelativePath: jest.fn().mockReturnValue({
      files: {
        select: jest.fn().mockReturnThis(),
        expand: jest.fn().mockReturnThis().mockResolvedValue([]),
      },
      folders: {
        select: jest.fn().mockReturnThis(),
        expand: jest.fn().mockReturnThis().mockResolvedValue([]),
      },
      addSubFolderUsingPath: jest.fn().mockResolvedValue({}),
    }),
    hasPermissions: jest.fn().mockReturnValue(true),
    siteUsers: {
      getByEmail: jest.fn().mockReturnValue(() => Promise.resolve({ Id: 1 })),
    },
    getParentWeb: jest.fn().mockResolvedValue({
      select: jest.fn().mockReturnThis(),
    }),
    select: jest.fn().mockReturnThis(),
    mockResolvedValue: jest.fn(),
  },
  profiles: {
    clientPeoplePickerSearchUser: jest.fn().mockResolvedValue([]),
    clientPeoplePickerResolveUser: jest.fn().mockResolvedValue({}),
  },
  search: jest.fn().mockResolvedValue({
    PrimarySearchResults: [],
    TotalRows: 0,
  }),
  site: {
    select: jest.fn().mockReturnThis(),
    mockResolvedValue: jest.fn(),
    mockRejectedValue: jest.fn(),
  },
};

// Add batched method after initialization to avoid circular reference
mockSPFI.batched = jest.fn().mockReturnValue([mockSPFI, jest.fn().mockResolvedValue(undefined)]);

/**
 * Mock GraphFI instance for testing
 */
const mockGraphFI = {
  me: jest.fn().mockResolvedValue({
    displayName: 'John Doe',
    mail: 'john.doe@example.com',
    id: 'user-id-123',
  }),
  users: {
    getById: jest.fn().mockReturnValue(() =>
      Promise.resolve({
        displayName: 'Jane Doe',
        mail: 'jane.doe@example.com',
        id: 'user-id-456',
      })
    ),
  },
};

/**
 * Mock getSp function
 */
export const getSp = jest.fn((context?: WebPartContext) => mockSPFI);

/**
 * Mock getGraph function
 */
export const getGraph = jest.fn((context?: WebPartContext) => mockGraphFI);
