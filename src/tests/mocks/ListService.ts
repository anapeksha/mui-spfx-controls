import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IFieldInfo } from '@pnp/sp/fields';
import { IListInfo } from '@pnp/sp/lists';

/**
 * Mocked SharePoint Fields with various field types.
 */
export const mockedFields: IFieldInfo[] = [
  { InternalName: 'Title', FieldTypeKind: 2, Hidden: false } as IFieldInfo, // Single line of text
  { InternalName: 'Created', FieldTypeKind: 4, Hidden: false } as IFieldInfo, // DateTime
  {
    InternalName: 'AssignedTo',
    FieldTypeKind: 20,
    Hidden: false,
  } as IFieldInfo, // User field
  { InternalName: 'Status', FieldTypeKind: 6, Hidden: false } as IFieldInfo, // Choice field
  { InternalName: 'Priority', FieldTypeKind: 9, Hidden: false } as IFieldInfo, // Number field
];

/**
 * Mocked SharePoint List Items with various field types.
 */
export const mockedListItems = [
  {
    Id: 1,
    Title: 'Project Alpha',
    Created: '2024-03-09T12:00:00Z',
    AssignedTo: { Title: 'John Doe', EMail: 'john@example.com' },
    Status: 'Active',
    Priority: '1',
  },
  {
    Id: 2,
    Title: 'Project Beta',
    Created: '2024-03-08T08:30:00Z',
    AssignedTo: { Title: 'Jane Doe', EMail: 'jane@example.com' },
    Status: 'Pending',
    Priority: '2',
  },
  {
    Id: 3,
    Title: 'Project Gamma',
    Created: '2024-03-07T14:15:00Z',
    AssignedTo: { Title: 'Alice Smith', EMail: 'alice@example.com' },
    Status: 'Completed',
    Priority: '3',
  },
  {
    Id: 4,
    Title: 'Project Delta',
    Created: '2024-03-06T10:45:00Z',
    AssignedTo: { Title: 'Bob Brown', EMail: 'bob@example.com' },
    Status: 'On Hold',
    Priority: '4',
  },
  {
    Id: 5,
    Title: 'Project Epsilon',
    Created: '2024-03-05T09:00:00Z',
    AssignedTo: { Title: 'Charlie Green', EMail: 'charlie@example.com' },
    Status: 'In Progress',
    Priority: '5',
  },
];

/**
 * Mock ListService to simulate SharePoint API interactions.
 */
export class ListService {
  constructor(context: WebPartContext, listId: string) {}

  /**
   * Filters fields to exclude hidden fields.
   * @param field The field object.
   * @returns True if the field should be included.
   */
  private checkCustomFieldType(field: IFieldInfo): boolean {
    return !field.Hidden;
  }

  /**
   * Returns a list of mock SharePoint lists.
   * @returns A promise resolving to an array of IListInfo.
   */
  public async getLists(): Promise<IListInfo[]> {
    return Promise.resolve([
      { Id: '1', Title: 'Documents', ItemCount: 100 } as IListInfo,
      { Id: '2', Title: 'Projects', ItemCount: 50 } as IListInfo,
      { Id: '3', Title: 'Tasks', ItemCount: 75 } as IListInfo,
    ]);
  }

  /**
   * Returns a list of fields available in the list.
   * @param fieldInternalNames Optional array of field internal names to filter.
   * @returns A promise resolving to an array of IFieldInfo.
   */
  public async getListFields(
    fieldInternalNames?: string[]
  ): Promise<IFieldInfo[]> {
    return Promise.resolve(
      mockedFields.filter(
        (field) =>
          this.checkCustomFieldType(field) &&
          (fieldInternalNames
            ? fieldInternalNames.includes(field.InternalName)
            : true)
      )
    );
  }

  /**
   * Returns list items based on provided fields, filters, and sorting.
   * @param fields Array of IFieldInfo defining which fields to retrieve.
   * @param filter Optional filter string.
   * @param orderBy Optional field name to order by.
   * @param top Optional limit on the number of items returned.
   * @returns A promise resolving to an array of list items.
   */
  public async getListItems(
    fields: IFieldInfo[],
    filter?: string,
    orderBy?: string,
    top?: number
  ): Promise<any[]> {
    let filteredItems = [...mockedListItems];

    if (filter) {
      filteredItems = filteredItems.filter((item) =>
        JSON.stringify(item).includes(filter)
      );
    }

    if (orderBy) {
      filteredItems.sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        return aValue > bValue ? 1 : -1;
      });
    }

    return Promise.resolve(top ? filteredItems.slice(0, top) : filteredItems);
  }

  /**
   * Simulates creating a new list item.
   * @param value The item to create.
   * @returns A promise resolving to the newly created item.
   */
  public async createListItem(value: any): Promise<any> {
    return Promise.resolve({ Id: mockedListItems.length + 1, ...value });
  }
}
