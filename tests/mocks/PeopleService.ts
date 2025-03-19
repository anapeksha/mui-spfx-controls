import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPeoplePickerEntity } from '../../src/components/PeoplePicker/IPeoplePickerProps';

export const mockUser = {
  Key: 'mock-user-key',
  DisplayText: 'John Doe',
  Description: 'john.doe@example.com',
  EntityData: { Email: 'john.doe@example.com', PrincipalType: 'User' },
  Image: 'https://example.com/profile.jpg',
} as IPeoplePickerEntity;

export const mockUsers = [
  {
    Key: 'mock-user-key-1',
    DisplayText: 'John Doe',
    Description: 'john.doe@example.com',
    EntityData: { Email: 'john.doe@example.com', PrincipalType: 'User' },
    Image: 'https://example.com/profile1.jpg',
  },
  {
    Key: 'mock-user-key-2',
    DisplayText: 'Jane Smith',
    Description: 'jane.smith@example.com',
    EntityData: { Email: 'jane.smith@example.com', PrincipalType: 'User' },
    Image: 'https://example.com/profile2.jpg',
  },
  {
    Key: 'mock-user-key-3',
    DisplayText: 'Michael Johnson',
    Description: 'michael.johnson@example.com',
    EntityData: { Email: 'michael.johnson@example.com', PrincipalType: 'User' },
    Image: 'https://example.com/profile3.jpg',
  },
  {
    Key: 'mock-user-key-4',
    DisplayText: 'Emily Davis',
    Description: 'emily.davis@example.com',
    EntityData: { Email: 'emily.davis@example.com', PrincipalType: 'User' },
    Image: 'https://example.com/profile4.jpg',
  },
  {
    Key: 'mock-user-key-5',
    DisplayText: 'Robert Brown',
    Description: 'robert.brown@example.com',
    EntityData: { Email: 'robert.brown@example.com', PrincipalType: 'User' },
    Image: 'https://example.com/profile5.jpg',
  },
] as IPeoplePickerEntity[];

export class PeopleService {
  constructor(context: WebPartContext) {}

  public async searchUser(
    context: WebPartContext,
    query: string,
    maximumSuggestions?: number
  ): Promise<IPeoplePickerEntity[]> {
    return Promise.resolve(mockUsers);
  }

  public async resolveUser(
    context: WebPartContext,
    query: string
  ): Promise<IPeoplePickerEntity> {
    return Promise.resolve(mockUser);
  }
}
