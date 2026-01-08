jest.mock('../../src/config/pnp.config', () =>
  jest.requireActual('../mocks/pnp.config')
);

import { User } from '@microsoft/microsoft-graph-types';
import { UserService } from '../../src/services/UserService';
import { mockedContext } from '../mocks/context';
import { getGraph } from '../mocks/pnp.config';

describe('UserService', () => {
  let service: UserService;
  let mockGraph: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService(mockedContext);
    mockGraph = getGraph();
  });

  describe('getCurrentUser', () => {
    it('should fetch current user profile successfully', async () => {
      const mockUser: User = {
        displayName: 'John Doe',
        mail: 'john.doe@example.com',
        id: 'user-id-123',
        userPrincipalName: 'john.doe@example.com',
        jobTitle: 'Developer',
        officeLocation: 'Building 5',
      };

      mockGraph.me.mockResolvedValue(mockUser);

      const result = await service.getCurrentUser();

      expect(mockGraph.me).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
      expect(result.displayName).toBe('John Doe');
      expect(result.mail).toBe('john.doe@example.com');
    });

    it('should handle user with minimal profile data', async () => {
      const minimalUser: User = {
        displayName: 'Test User',
        id: 'user-id-456',
      };

      mockGraph.me.mockResolvedValue(minimalUser);

      const result = await service.getCurrentUser();

      expect(result.displayName).toBe('Test User');
      expect(result.id).toBe('user-id-456');
      expect(result.mail).toBeUndefined();
    });

    it('should propagate errors from Graph API', async () => {
      mockGraph.me.mockRejectedValue(new Error('Unauthorized'));

      await expect(service.getCurrentUser()).rejects.toThrow('Unauthorized');
    });

    it('should handle different user properties', async () => {
      const detailedUser: User = {
        displayName: 'Jane Smith',
        mail: 'jane.smith@example.com',
        id: 'user-id-789',
        userPrincipalName: 'jane.smith@example.com',
        givenName: 'Jane',
        surname: 'Smith',
        jobTitle: 'Senior Developer',
        department: 'Engineering',
        officeLocation: 'Building 10',
        mobilePhone: '+1-555-0100',
        businessPhones: ['+1-555-0199'],
      };

      mockGraph.me.mockResolvedValue(detailedUser);

      const result = await service.getCurrentUser();

      expect(result.givenName).toBe('Jane');
      expect(result.surname).toBe('Smith');
      expect(result.department).toBe('Engineering');
      expect(result.jobTitle).toBe('Senior Developer');
    });
  });

  describe('getUser', () => {
    it('should fetch user by UPN successfully', async () => {
      const mockUser: User = {
        displayName: 'Jane Doe',
        mail: 'jane.doe@example.com',
        id: 'user-id-456',
        userPrincipalName: 'jane.doe@example.com',
      };

      mockGraph.users.getById.mockReturnValue(() => Promise.resolve(mockUser));

      const result = await service.getUser('jane.doe@example.com');

      expect(mockGraph.users.getById).toHaveBeenCalledWith('jane.doe@example.com');
      expect(result).toEqual(mockUser);
      expect(result.displayName).toBe('Jane Doe');
    });

    it('should fetch user by user ID', async () => {
      const mockUser: User = {
        displayName: 'Bob Smith',
        mail: 'bob.smith@example.com',
        id: 'user-id-789',
      };

      mockGraph.users.getById.mockReturnValue(() => Promise.resolve(mockUser));

      const result = await service.getUser('user-id-789');

      expect(mockGraph.users.getById).toHaveBeenCalledWith('user-id-789');
      expect(result.id).toBe('user-id-789');
    });

    it('should handle user not found error', async () => {
      mockGraph.users.getById.mockReturnValue(() =>
        Promise.reject(new Error('User not found'))
      );

      await expect(service.getUser('nonexistent@example.com')).rejects.toThrow(
        'User not found'
      );
    });

    it('should handle permission errors', async () => {
      mockGraph.users.getById.mockReturnValue(() =>
        Promise.reject(new Error('Insufficient permissions'))
      );

      await expect(service.getUser('restricted@example.com')).rejects.toThrow(
        'Insufficient permissions'
      );
    });

    it('should fetch different users sequentially', async () => {
      const user1: User = {
        displayName: 'User One',
        mail: 'user1@example.com',
        id: 'id-1',
      };

      const user2: User = {
        displayName: 'User Two',
        mail: 'user2@example.com',
        id: 'id-2',
      };

      mockGraph.users.getById
        .mockReturnValueOnce(() => Promise.resolve(user1))
        .mockReturnValueOnce(() => Promise.resolve(user2));

      const result1 = await service.getUser('user1@example.com');
      const result2 = await service.getUser('user2@example.com');

      expect(result1.displayName).toBe('User One');
      expect(result2.displayName).toBe('User Two');
    });

    it('should handle user with complete profile', async () => {
      const completeUser: User = {
        displayName: 'Complete User',
        mail: 'complete@example.com',
        id: 'complete-id',
        userPrincipalName: 'complete@example.com',
        givenName: 'Complete',
        surname: 'User',
        jobTitle: 'Manager',
        department: 'Sales',
        officeLocation: 'HQ',
        mobilePhone: '+1-555-1234',
        businessPhones: ['+1-555-5678'],
        preferredLanguage: 'en-US',
      };

      mockGraph.users.getById.mockReturnValue(() => Promise.resolve(completeUser));

      const result = await service.getUser('complete@example.com');

      expect(result.displayName).toBe('Complete User');
      expect(result.jobTitle).toBe('Manager');
      expect(result.department).toBe('Sales');
      expect(result.preferredLanguage).toBe('en-US');
    });

    it('should handle empty or null email values', async () => {
      const userWithoutEmail: User = {
        displayName: 'No Email User',
        id: 'no-email-id',
        userPrincipalName: 'noemail@example.com',
      };

      mockGraph.users.getById.mockReturnValue(() =>
        Promise.resolve(userWithoutEmail)
      );

      const result = await service.getUser('noemail@example.com');

      expect(result.displayName).toBe('No Email User');
      expect(result.mail).toBeUndefined();
    });
  });
});
