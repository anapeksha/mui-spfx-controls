import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IPeoplePickerEntity } from '../../components/PeoplePicker/IPeoplePickerProps';

export const mockUser = {
  Key: 'mock-user-key',
  DisplayText: 'John Doe',
  Description: 'john.doe@example.com',
  EntityData: { Email: 'john.doe@example.com', PrincipalType: 'User' },
  Image: 'https://example.com/profile.jpg',
} as unknown as IPeoplePickerEntity;

export const mockUserList: IPeoplePickerEntity[] = [mockUser];

export class PeopleSearchService {
  constructor(context: WebPartContext) {}

  public async searchUser(
    context: WebPartContext,
    query: string,
    maximumSuggestions?: number
  ): Promise<IPeoplePickerEntity[]> {
    return Promise.resolve(mockUserList);
  }

  public async resolveUser(
    context: WebPartContext,
    query: string
  ): Promise<IPeoplePickerEntity> {
    return Promise.resolve(mockUser);
  }
}
