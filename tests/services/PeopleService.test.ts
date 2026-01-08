jest.mock('../../src/config/pnp.config', () =>
  jest.requireActual('../mocks/pnp.config')
);
jest.mock('../../src/utils/generateImageUrl', () => ({
  generateImageUrl: jest.fn(
    (context: any, email: string) => `https://example.com/photo/${email}`
  ),
}));

import { PrincipalSource, PrincipalType } from '@pnp/sp';
import { IPeoplePickerEntity as IBasePeoplePickerEntity } from '@pnp/sp/profiles';
import { PeopleService } from '../../src/services/PeopleService';
import { generateImageUrl } from '../../src/utils/generateImageUrl';
import { mockedContext } from '../mocks/context';
import { getSp } from '../mocks/pnp.config';

describe('PeopleService', () => {
  let service: PeopleService;
  let mockSp: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PeopleService(mockedContext);
    mockSp = getSp();
  });

  describe('searchUser', () => {
    const mockUsers: IBasePeoplePickerEntity[] = [
      {
        Key: 'i:0#.f|membership|john@example.com',
        DisplayText: 'John Doe',
        Description: 'john@example.com',
        EntityData: {
          PrincipalType: 'User',
          Email: 'john@example.com',
        },
      } as IBasePeoplePickerEntity,
      {
        Key: 'i:0#.f|membership|jane@example.com',
        DisplayText: 'Jane Smith',
        Description: 'jane@example.com',
        EntityData: {
          PrincipalType: 'User',
          Email: 'jane@example.com',
        },
      } as IBasePeoplePickerEntity,
    ];

    it('should search for users with default parameters', async () => {
      mockSp.profiles.clientPeoplePickerSearchUser.mockResolvedValue(mockUsers);

      const result = await service.searchUser(mockedContext, 'john');

      expect(mockSp.profiles.clientPeoplePickerSearchUser).toHaveBeenCalledWith({
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        AllUrlZones: false,
        MaximumEntitySuggestions: 25,
        PrincipalSource: PrincipalSource.All,
        PrincipalType: PrincipalType.All,
        QueryString: 'john',
      });
      expect(result).toHaveLength(2);
      expect(result[0].Image).toBe('https://example.com/photo/john@example.com');
    });

    it('should search for users with custom parameters', async () => {
      mockSp.profiles.clientPeoplePickerSearchUser.mockResolvedValue(mockUsers);

      const result = await service.searchUser(
        mockedContext,
        'jane',
        10,
        PrincipalSource.UserInfoList,
        PrincipalType.User
      );

      expect(mockSp.profiles.clientPeoplePickerSearchUser).toHaveBeenCalledWith({
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        AllUrlZones: false,
        MaximumEntitySuggestions: 10,
        PrincipalSource: PrincipalSource.UserInfoList,
        PrincipalType: PrincipalType.User,
        QueryString: 'jane',
      });
      expect(result).toHaveLength(2);
    });

    it('should filter out unvalidated email addresses', async () => {
      const usersWithUnvalidated: IBasePeoplePickerEntity[] = [
        ...mockUsers,
        {
          Key: 'unvalidated@example.com',
          DisplayText: 'Unvalidated User',
          Description: 'unvalidated@example.com',
          EntityData: {
            PrincipalType: 'UNVALIDATED_EMAIL_ADDRESS',
            Email: 'unvalidated@example.com',
          },
        } as IBasePeoplePickerEntity,
      ];

      mockSp.profiles.clientPeoplePickerSearchUser.mockResolvedValue(
        usersWithUnvalidated
      );

      const result = await service.searchUser(mockedContext, 'test');

      expect(result).toHaveLength(2);
      expect(result.every((u) => u.EntityData.PrincipalType !== 'UNVALIDATED_EMAIL_ADDRESS')).toBe(
        true
      );
    });

    it('should generate image URL from description when available', async () => {
      const userWithDescription: IBasePeoplePickerEntity[] = [
        {
          Key: 'user@example.com',
          DisplayText: 'Test User',
          Description: 'test@example.com',
          EntityData: {
            PrincipalType: 'User',
            Email: 'different@example.com',
          },
        } as IBasePeoplePickerEntity,
      ];

      mockSp.profiles.clientPeoplePickerSearchUser.mockResolvedValue(
        userWithDescription
      );

      const result = await service.searchUser(mockedContext, 'test');

      expect(generateImageUrl).toHaveBeenCalledWith(
        mockedContext,
        'test@example.com'
      );
      expect(result[0].Image).toBe('https://example.com/photo/test@example.com');
    });

    it('should generate image URL from email when description is empty', async () => {
      const userWithoutDescription: IBasePeoplePickerEntity[] = [
        {
          Key: 'user@example.com',
          DisplayText: 'Test User',
          Description: '',
          EntityData: {
            PrincipalType: 'User',
            Email: 'email@example.com',
          },
        } as IBasePeoplePickerEntity,
      ];

      mockSp.profiles.clientPeoplePickerSearchUser.mockResolvedValue(
        userWithoutDescription
      );

      const result = await service.searchUser(mockedContext, 'test');

      expect(generateImageUrl).toHaveBeenCalledWith(
        mockedContext,
        'email@example.com'
      );
      expect(result[0].Image).toBe('https://example.com/photo/email@example.com');
    });

    it('should return empty array when no users found', async () => {
      mockSp.profiles.clientPeoplePickerSearchUser.mockResolvedValue([]);

      const result = await service.searchUser(mockedContext, 'nonexistent');

      expect(result).toEqual([]);
    });

    it('should handle users without PrincipalType in EntityData', async () => {
      const usersWithoutPrincipalType: IBasePeoplePickerEntity[] = [
        {
          Key: 'user@example.com',
          DisplayText: 'Test User',
          Description: 'test@example.com',
          EntityData: {
            Email: 'test@example.com',
          },
        } as IBasePeoplePickerEntity,
      ];

      mockSp.profiles.clientPeoplePickerSearchUser.mockResolvedValue(
        usersWithoutPrincipalType
      );

      const result = await service.searchUser(mockedContext, 'test');

      expect(result).toHaveLength(1);
    });
  });

  describe('resolveUser', () => {
    const mockResolvedUser: IBasePeoplePickerEntity = {
      Key: 'i:0#.f|membership|john@example.com',
      DisplayText: 'John Doe',
      Description: 'john@example.com',
      EntityData: {
        PrincipalType: 'User',
        Email: 'john@example.com',
      },
    } as IBasePeoplePickerEntity;

    it('should resolve a user successfully', async () => {
      mockSp.profiles.clientPeoplePickerResolveUser.mockResolvedValue(
        mockResolvedUser
      );

      const result = await service.resolveUser(
        mockedContext,
        'john@example.com'
      );

      expect(mockSp.profiles.clientPeoplePickerResolveUser).toHaveBeenCalledWith({
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        AllUrlZones: false,
        MaximumEntitySuggestions: 25,
        PrincipalSource: PrincipalSource.All,
        PrincipalType: PrincipalType.All,
        QueryString: 'john@example.com',
      });
      expect(result.DisplayText).toBe('John Doe');
      expect(result.Image).toBe('https://example.com/photo/john@example.com');
    });

    it('should generate image URL from description when available', async () => {
      const userWithDescription: IBasePeoplePickerEntity = {
        ...mockResolvedUser,
        Description: 'john.doe@example.com',
      } as IBasePeoplePickerEntity;

      mockSp.profiles.clientPeoplePickerResolveUser.mockResolvedValue(
        userWithDescription
      );

      const result = await service.resolveUser(mockedContext, 'john');

      expect(generateImageUrl).toHaveBeenCalledWith(
        mockedContext,
        'john.doe@example.com'
      );
      expect(result.Image).toBe(
        'https://example.com/photo/john.doe@example.com'
      );
    });

    it('should generate image URL from email when description is empty', async () => {
      const userWithoutDescription: IBasePeoplePickerEntity = {
        ...mockResolvedUser,
        Description: '',
        EntityData: {
          PrincipalType: 'User',
          Email: 'fallback@example.com',
        },
      } as IBasePeoplePickerEntity;

      mockSp.profiles.clientPeoplePickerResolveUser.mockResolvedValue(
        userWithoutDescription
      );

      const result = await service.resolveUser(mockedContext, 'user');

      expect(generateImageUrl).toHaveBeenCalledWith(
        mockedContext,
        'fallback@example.com'
      );
      expect(result.Image).toBe('https://example.com/photo/fallback@example.com');
    });

    it('should handle empty image when no description or email', async () => {
      const userWithNoContact: IBasePeoplePickerEntity = {
        Key: 'user',
        DisplayText: 'Test User',
        Description: '',
        EntityData: {
          PrincipalType: 'User',
          Email: '',
        },
      } as IBasePeoplePickerEntity;

      mockSp.profiles.clientPeoplePickerResolveUser.mockResolvedValue(
        userWithNoContact
      );

      const result = await service.resolveUser(mockedContext, 'user');

      expect(result.Image).toBe('');
    });
  });
});
