jest.mock('../../src/config/pnp.config', () => {
  const mockList = {
    getCurrentUserEffectivePermissions: jest.fn().mockResolvedValue({}),
    hasPermissions: jest.fn().mockReturnValue(true),
    items: {
      getById: jest.fn().mockReturnValue({
        update: jest.fn().mockResolvedValue(undefined),
      }),
      add: jest.fn().mockResolvedValue({ Id: 10 }),
      select: jest.fn().mockReturnThis(),
      expand: jest.fn().mockReturnThis(),
      filter: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      top: jest.fn(() => Promise.resolve([])),
      [Symbol.asyncIterator]: jest.fn(),
    },
    fields: jest.fn().mockResolvedValue([]),
    select: jest.fn(() => jest.fn().mockResolvedValue({ ItemCount: 100 })),
  };

  const mockLists = Object.assign(
    jest.fn().mockResolvedValue([]),
    { getById: jest.fn().mockReturnValue(mockList) }
  );

  const mockSPFI = {
    web: {
      lists: mockLists,
      siteUsers: {
        getByEmail: jest.fn().mockReturnValue(() => Promise.resolve({ Id: 1 })),
      },
    },
  };

  return {
    getSp: jest.fn(() => mockSPFI),
    getGraph: jest.fn(() => ({})),
  };
});

// Mock Logger module
jest.mock('@pnp/logging');

import { PermissionKind } from '@pnp/sp/security';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import { ListService } from '../../src/services/ListService';
import { mockedContext } from '../mocks/context';
import { getSp } from '../../src/config/pnp.config';

describe('ListService', () => {
  let service: ListService;
  let mockSp: any;
  const listId = 'test-list-id';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ListService(mockedContext, listId);
    mockSp = getSp();
  });

  describe('getLists', () => {
    it('should return all lists from the site', async () => {
      const mockLists = [
        { Id: '1', Title: 'List 1', ItemCount: 10 },
        { Id: '2', Title: 'List 2', ItemCount: 20 },
      ];
      (mockSp.web.lists as any).mockResolvedValue(mockLists);

      const result = await service.getLists();

      expect(result).toEqual(mockLists);
    });

    it('should return empty array when no lists exist', async () => {
      (mockSp.web.lists as any).mockResolvedValue([]);

      const result = await service.getLists();

      expect(result).toEqual([]);
    });
  });

  describe('getListFields', () => {
    const mockFields: IFieldInfo[] = [
      { InternalName: 'Title', FieldTypeKind: FieldTypes.Text, Hidden: false } as IFieldInfo,
      { InternalName: 'Status', FieldTypeKind: FieldTypes.Choice, Hidden: false } as IFieldInfo,
      { InternalName: 'HiddenField', FieldTypeKind: FieldTypes.Text, Hidden: true } as IFieldInfo,
      { InternalName: 'Priority', FieldTypeKind: FieldTypes.Number, Hidden: false } as IFieldInfo,
    ];

    it('should return all non-hidden fields when no filter is provided', async () => {
      const mockList = mockSp.web.lists.getById();
      mockList.fields.mockResolvedValue(mockFields);

      const result = await service.getListFields();

      expect(result).toHaveLength(3);
      expect(result.every((field) => !field.Hidden)).toBe(true);
      expect(result.find((f) => f.InternalName === 'HiddenField')).toBeUndefined();
    });

    it('should filter fields by internal names', async () => {
      const mockList = mockSp.web.lists.getById();
      mockList.fields.mockResolvedValue(mockFields);

      const result = await service.getListFields(['Title', 'Status']);

      expect(result).toHaveLength(2);
      expect(result.map((f) => f.InternalName)).toEqual(['Title', 'Status']);
    });

    it('should return empty array when no matching fields', async () => {
      const mockList = mockSp.web.lists.getById();
      mockList.fields.mockResolvedValue(mockFields);

      const result = await service.getListFields(['NonExistent']);

      expect(result).toEqual([]);
    });

    it('should exclude hidden fields even when specified in filter', async () => {
      const mockList = mockSp.web.lists.getById();
      mockList.fields.mockResolvedValue(mockFields);

      const result = await service.getListFields(['Title', 'HiddenField']);

      expect(result).toHaveLength(1);
      expect(result[0].InternalName).toBe('Title');
    });
  });

  describe('getListItems', () => {
    const mockFields: IFieldInfo[] = [
      { InternalName: 'Title', FieldTypeKind: FieldTypes.Text } as IFieldInfo,
      { InternalName: 'AssignedTo', FieldTypeKind: FieldTypes.User } as IFieldInfo,
      { InternalName: 'Status', FieldTypeKind: FieldTypes.Choice } as IFieldInfo,
    ];

    it('should retrieve list items with correct field selections', async () => {
      const mockItems = [
        { Id: 1, Title: 'Item 1', Status: 'Active' },
        { Id: 2, Title: 'Item 2', Status: 'Pending' },
      ];

      const mockList = mockSp.web.lists.getById();
      mockList.items.select.mockReturnValue({
        expand: jest.fn().mockReturnValue({
          filter: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              top: jest.fn(() => () => Promise.resolve(mockItems)),
            }),
          }),
        }),
      });

      const result = await service.getListItems(mockFields, '', 'Title', 10);

      expect(result).toEqual(mockItems);
      expect(mockList.items.select).toHaveBeenCalled();
    });

    it('should handle user fields with expand', async () => {
      const mockItems = [
        {
          Id: 1,
          Title: 'Item 1',
          AssignedTo: { Id: 5, Title: 'John Doe', EMail: 'john@example.com' },
        },
      ];

      const mockList = mockSp.web.lists.getById();
      const mockExpand = jest.fn().mockReturnValue({
        filter: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockReturnValue({
            top: jest.fn(() => () => Promise.resolve(mockItems)),
          }),
        }),
      });
      mockList.items.select.mockReturnValue({
        expand: mockExpand,
      });

      const result = await service.getListItems(mockFields, '', '', 10);

      expect(mockList.items.select).toHaveBeenCalled();
      expect(mockExpand).toHaveBeenCalled();
      expect(result).toEqual(mockItems);
    });

    it('should apply filter and orderBy parameters', async () => {
      const mockList = mockSp.web.lists.getById();
      const mockFilter = jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          top: jest.fn(() => () => Promise.resolve([])),
        }),
      });
      const mockExpand = jest.fn().mockReturnValue({
        filter: mockFilter,
      });
      mockList.items.select.mockReturnValue({
        expand: mockExpand,
      });

      await service.getListItems(
        mockFields,
        "Status eq 'Active'",
        'Title',
        10
      );

      expect(mockFilter).toHaveBeenCalledWith("Status eq 'Active'");
      expect(mockFilter().orderBy).toHaveBeenCalledWith('Title', false);
    });

    it('should handle pagination when top is not specified', async () => {
      const mockItems = [
        { Id: 1, Title: 'Item 1' },
        { Id: 2, Title: 'Item 2' },
      ];

      const mockList = mockSp.web.lists.getById();
      
      // Mock async iterator on the orderBy result
      const asyncIterator = {
        [Symbol.asyncIterator]: async function* () {
          yield mockItems;
        }
      };

      mockList.items.select.mockReturnValue({
        expand: jest.fn().mockReturnValue({
          filter: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue(asyncIterator),
          }),
        }),
      });

      const result = await service.getListItems(mockFields);

      expect(result).toHaveLength(2);
    });
  });

  describe('createListItem', () => {
    it('should create a new list item when user has permission', async () => {
      const newItem = { Title: 'New Item', Status: 'Active' };
      const createdItem = { Id: 10, ...newItem };

      const mockList = mockSp.web.lists.getById();
      mockList.hasPermissions.mockReturnValue(true);
      mockList.items.add.mockResolvedValue(createdItem);

      const result = await service.createListItem(newItem);

      expect(result).toEqual(createdItem);
      expect(mockList.items.add).toHaveBeenCalledWith(newItem);
    });

    it('should throw error when user lacks AddListItems permission', async () => {
      const mockList = mockSp.web.lists.getById();
      mockList.hasPermissions.mockReturnValue(false);

      await expect(service.createListItem({ Title: 'Test' })).rejects.toThrow(
        'Permission Error'
      );
    });
  });

  describe('updateListItem', () => {
    it('should update a list item when user has permission', async () => {
      const updateData = { Title: 'Updated Title', Status: 'Completed' };

      const mockList = mockSp.web.lists.getById();
      mockList.hasPermissions.mockReturnValue(true);

      await service.updateListItem(1, updateData);

      const mockItem = mockList.items.getById(1);
      expect(mockItem.update).toHaveBeenCalled();
    });

    it('should throw error when user lacks EditListItems permission', async () => {
      const mockList = mockSp.web.lists.getById();
      mockList.hasPermissions.mockReturnValue(false);

      await expect(
        service.updateListItem(1, { Title: 'Test' })
      ).rejects.toThrow('Permission Error');
    });

    it('should exclude system fields from update', async () => {
      const updateData = {
        Title: 'Updated',
        ID: 1,
        Created: '2024-01-01',
        Modified: '2024-01-02',
        Author: 'User',
        Editor: 'User',
        GUID: 'guid',
        Version: '1.0',
        Attachments: true,
      };

      const mockList = mockSp.web.lists.getById();
      mockList.hasPermissions.mockReturnValue(true);

      await service.updateListItem(1, updateData);

      const mockItem = mockList.items.getById(1);
      const updateCall = mockItem.update.mock.calls[0][0];
      expect(updateCall.ID).toBeUndefined();
      expect(updateCall.Created).toBeUndefined();
      expect(updateCall.Modified).toBeUndefined();
    });

    it('should resolve user email to user ID', async () => {
      const updateData = {
        Title: 'Updated',
        AssignedTo: { EMail: 'user@example.com' },
      };

      const mockList = mockSp.web.lists.getById();
      mockList.hasPermissions.mockReturnValue(true);
      mockSp.web.siteUsers.getByEmail.mockReturnValue(() =>
        Promise.resolve({ Id: 5 })
      );

      await service.updateListItem(1, updateData);

      const mockItem = mockList.items.getById(1);
      expect(mockItem.update).toHaveBeenCalledWith({
        Title: 'Updated',
        AssignedToId: 5,
      });
    });

    it('should handle user email resolution error', async () => {
      const updateData = {
        Title: 'Updated',
        AssignedTo: { EMail: 'invalid@example.com' },
      };

      const mockList = mockSp.web.lists.getById();
      mockList.hasPermissions.mockReturnValue(true);
      mockSp.web.siteUsers.getByEmail.mockReturnValue(() => 
        Promise.reject(new Error('User not found'))
      );

      await service.updateListItem(1, updateData);

      const mockItem = mockList.items.getById(1);
      expect(mockItem.update).toHaveBeenCalledWith({
        Title: 'Updated',
      });
    });
  });
});
