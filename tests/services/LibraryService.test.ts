jest.mock('../../src/config/pnp.config', () => {
  const createMockFolderRef = () => ({
    files: {
      select: jest.fn().mockReturnValue({
        expand: jest.fn().mockReturnValue(Promise.resolve([])),
      }),
    },
    folders: {
      select: jest.fn().mockReturnValue({
        expand: jest.fn().mockReturnValue(Promise.resolve([])),
      }),
    },
    addSubFolderUsingPath: jest.fn().mockResolvedValue({}),
  });

  const mockList = {
    getCurrentUserEffectivePermissions: jest.fn().mockResolvedValue({}),
    items: {
      getById: jest.fn((id: number) => ({
        recycle: jest.fn().mockResolvedValue(`recycled-${id}`),
      })),
    },
  };

  const mockBatchedSp = {
    web: {
      lists: {
        getById: jest.fn().mockReturnValue(mockList),
      },
    },
  };

  const mockSPFI = {
    web: {
      lists: {
        getById: jest.fn().mockReturnValue(mockList),
      },
      getFolderByServerRelativePath: jest.fn(() => createMockFolderRef()),
      hasPermissions: jest.fn().mockReturnValue(true),
    },
    batched: jest.fn().mockReturnValue([mockBatchedSp, jest.fn().mockResolvedValue(undefined)]),
  };

  return {
    getSp: jest.fn(() => mockSPFI),
    getGraph: jest.fn(() => ({})),
  };
});

import { PermissionKind } from '@pnp/sp/security';
import { LibraryService, Permission } from '../../src/services/LibraryService';
import { mockedContext } from '../mocks/context';
import { getSp } from '../../src/config/pnp.config';

describe('LibraryService', () => {
  let service: LibraryService;
  let mockSp: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LibraryService(mockedContext);
    mockSp = getSp();
  });

  describe('getEffectivePermissions', () => {
    it('should return all permissions when user has full permissions', async () => {
      const mockPermissions = {};
      const mockList = mockSp.web.lists.getById();
      mockList.getCurrentUserEffectivePermissions.mockResolvedValue(mockPermissions);
      mockSp.web.hasPermissions.mockReturnValue(true);

      const permissions = await service.getEffectivePermissions('list-id-123');

      expect(permissions).toEqual([
        Permission.View,
        Permission.Add,
        Permission.Edit,
        Permission.Delete,
        Permission.ManagePermissions,
      ]);
    });

    it('should return empty array when user has no permissions', async () => {
      const mockPermissions = {};
      const mockList = mockSp.web.lists.getById();
      mockList.getCurrentUserEffectivePermissions.mockResolvedValue(mockPermissions);
      mockSp.web.hasPermissions.mockReturnValue(false);

      const permissions = await service.getEffectivePermissions('list-id-123');

      expect(permissions).toEqual([]);
    });

    it('should check all permission kinds', async () => {
      const mockPermissions = {};
      const mockList = mockSp.web.lists.getById();
      mockList.getCurrentUserEffectivePermissions.mockResolvedValue(mockPermissions);
      
      // Track which permissions are checked
      const checkedPermissions: PermissionKind[] = [];
      mockSp.web.hasPermissions.mockImplementation((perms: any, kind: PermissionKind) => {
        checkedPermissions.push(kind);
        return true;
      });

      await service.getEffectivePermissions('list-id-123');

      expect(checkedPermissions).toContain(PermissionKind.ViewListItems);
      expect(checkedPermissions).toContain(PermissionKind.AddListItems);
      expect(checkedPermissions).toContain(PermissionKind.EditListItems);
      expect(checkedPermissions).toContain(PermissionKind.DeleteListItems);
      expect(checkedPermissions).toContain(PermissionKind.ManagePermissions);
    });
  });

  describe('createNewFolder', () => {
    it('should create a new folder successfully', async () => {
      const mockFolder = { Name: 'NewFolder', ServerRelativeUrl: '/path/NewFolder' };
      
      mockSp.web.getFolderByServerRelativePath = jest.fn().mockReturnValue({
        addSubFolderUsingPath: jest.fn().mockResolvedValue(mockFolder),
      });

      const result = await service.createNewFolder('/sites/test/library', 'NewFolder');

      expect(result).toEqual(mockFolder);
      expect(mockSp.web.getFolderByServerRelativePath).toHaveBeenCalledWith('/sites/test/library');
    });

    it('should handle different paths and folder names', async () => {
      const mockFolder = { Name: 'SubFolder', ServerRelativeUrl: '/path/SubFolder' };
      
      mockSp.web.getFolderByServerRelativePath = jest.fn().mockReturnValue({
        addSubFolderUsingPath: jest.fn().mockResolvedValue(mockFolder),
      });

      const result = await service.createNewFolder('/different/path', 'SubFolder');

      expect(result).toEqual(mockFolder);
      expect(mockSp.web.getFolderByServerRelativePath).toHaveBeenCalledWith('/different/path');
    });
  });

  describe('getLibraryItems', () => {
    it('should return both folders and files', async () => {
      const mockFiles = [
        { Name: 'Document1.docx', ServerRelativeUrl: '/path/Document1.docx', ListItemAllFields: { Id: 1 } },
        { Name: 'Document2.pdf', ServerRelativeUrl: '/path/Document2.pdf', ListItemAllFields: { Id: 2 } },
      ];
      const mockFolders = [
        { Name: 'Folder1', ServerRelativeUrl: '/path/Folder1', ListItemAllFields: { Id: 3 } },
      ];

      mockSp.web.getFolderByServerRelativePath = jest.fn().mockReturnValue({
        files: {
          select: jest.fn().mockReturnValue({
            expand: jest.fn(() => () => Promise.resolve(mockFiles)),
          }),
        },
        folders: {
          select: jest.fn().mockReturnValue({
            expand: jest.fn(() => () => Promise.resolve(mockFolders)),
          }),
        },
      });

      const result = await service.getLibraryItems('/sites/test/library');

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ ...mockFolders[0], Type: 'folder' });
      expect(result[1]).toEqual({ ...mockFiles[0], Type: 'file', Extension: 'docx' });
      expect(result[2]).toEqual({ ...mockFiles[1], Type: 'file', Extension: 'pdf' });
    });

    it('should handle files without extensions', async () => {
      const mockFiles = [
        { Name: 'README', ServerRelativeUrl: '/path/README', ListItemAllFields: { Id: 1 } },
      ];

      mockSp.web.getFolderByServerRelativePath = jest.fn().mockReturnValue({
        files: {
          select: jest.fn().mockReturnValue({
            expand: jest.fn(() => () => Promise.resolve(mockFiles)),
          }),
        },
        folders: {
          select: jest.fn().mockReturnValue({
            expand: jest.fn(() => () => Promise.resolve([])),
          }),
        },
      });

      const result = await service.getLibraryItems('/sites/test/library');

      expect(result[0].Extension).toBe('unknown');
    });

    it('should return empty array when no items exist', async () => {
      mockSp.web.getFolderByServerRelativePath = jest.fn().mockReturnValue({
        files: {
          select: jest.fn().mockReturnValue({
            expand: jest.fn(() => () => Promise.resolve([])),
          }),
        },
        folders: {
          select: jest.fn().mockReturnValue({
            expand: jest.fn(() => () => Promise.resolve([])),
          }),
        },
      });

      const result = await service.getLibraryItems('/sites/test/library');

      expect(result).toEqual([]);
    });

    it('should handle multiple file extensions', async () => {
      const mockFiles = [
        { Name: 'document.docx', ServerRelativeUrl: '/path/document.docx', ListItemAllFields: { Id: 1 } },
        { Name: 'image.png', ServerRelativeUrl: '/path/image.png', ListItemAllFields: { Id: 2 } },
        { Name: 'archive.tar.gz', ServerRelativeUrl: '/path/archive.tar.gz', ListItemAllFields: { Id: 3 } },
      ];

      mockSp.web.getFolderByServerRelativePath = jest.fn().mockReturnValue({
        files: {
          select: jest.fn().mockReturnValue({
            expand: jest.fn(() => () => Promise.resolve(mockFiles)),
          }),
        },
        folders: {
          select: jest.fn().mockReturnValue({
            expand: jest.fn(() => () => Promise.resolve([])),
          }),
        },
      });

      const result = await service.getLibraryItems('/sites/test/library');

      expect(result[0].Extension).toBe('docx');
      expect(result[1].Extension).toBe('png');
      expect(result[2].Extension).toBe('gz');
    });
  });

  describe('recycleItems', () => {
    it('should recycle multiple items successfully', async () => {
      const itemIds = [1, 2, 3];
      
      const result = await service.recycleItems('list-id-123', itemIds);

      expect(mockSp.batched).toHaveBeenCalled();
      expect(result).toHaveLength(3);
    });

    it('should handle single item recycling', async () => {
      const itemIds = [5];
      
      const result = await service.recycleItems('list-id-123', itemIds);

      expect(result).toHaveLength(1);
    });

    it('should handle empty item array', async () => {
      const itemIds: number[] = [];
      
      const result = await service.recycleItems('list-id-123', itemIds);

      expect(mockSp.batched).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
