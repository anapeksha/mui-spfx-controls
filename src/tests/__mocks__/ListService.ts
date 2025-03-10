import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IFieldInfo } from '@pnp/sp/fields';
import { IListInfo } from '@pnp/sp/lists';

// Mock ListService
class ListService {
  constructor(context: WebPartContext, listId: string) {}

  private checkCustomFieldType(field: IFieldInfo): boolean {
    return !field.Hidden;
  }

  public async getLists(): Promise<IListInfo[]> {
    return Promise.resolve([
      { Id: '1', Title: 'Documents', ItemCount: 100 } as IListInfo,
      { Id: '2', Title: 'Projects', ItemCount: 50 } as IListInfo,
      { Id: '3', Title: 'Tasks', ItemCount: 75 } as IListInfo,
    ]);
  }

  public async getListFields(
    fieldInternalNames?: string[]
  ): Promise<IFieldInfo[]> {
    const allFields: IFieldInfo[] = [
      { InternalName: 'Title', FieldTypeKind: 2, Hidden: false } as IFieldInfo,
      {
        InternalName: 'Created',
        FieldTypeKind: 4,
        Hidden: false,
      } as IFieldInfo,
      {
        InternalName: 'AssignedTo',
        FieldTypeKind: 20,
        Hidden: false,
      } as IFieldInfo, // User field
      { InternalName: 'Status', FieldTypeKind: 2, Hidden: false } as IFieldInfo,
      {
        InternalName: 'HiddenField',
        FieldTypeKind: 2,
        Hidden: true,
      } as IFieldInfo,
    ];

    return Promise.resolve(
      allFields.filter(
        (field) =>
          this.checkCustomFieldType(field) &&
          (fieldInternalNames
            ? fieldInternalNames.indexOf(field.InternalName) !== -1
            : true)
      )
    );
  }

  public async getListItems(
    fields: IFieldInfo[],
    filter?: string,
    orderBy?: string,
    top?: number
  ): Promise<any[]> {
    const mockItems = [
      {
        Id: 1,
        Title: 'Project A',
        Created: '2024-03-09',
        AssignedTo: { Title: 'John Doe', EMail: 'john@example.com' },
        Status: 'Active',
      },
      {
        Id: 2,
        Title: 'Project B',
        Created: '2024-03-08',
        AssignedTo: { Title: 'Jane Doe', EMail: 'jane@example.com' },
        Status: 'Pending',
      },
      {
        Id: 3,
        Title: 'Project C',
        Created: '2024-03-07',
        AssignedTo: { Title: 'Alice', EMail: 'alice@example.com' },
        Status: 'Completed',
      },
    ];

    let filteredItems = mockItems;

    if (filter) {
      filteredItems = filteredItems.filter(
        (item) => JSON.stringify(item).indexOf(filter) !== -1
      );
    }

    if (orderBy) {
      filteredItems.sort((a, b) => {
        const keys = orderBy.split('.');
        let aValue: any = a;
        let bValue: any = b;

        for (const key of keys) {
          aValue = aValue?.[key];
          bValue = bValue?.[key];
        }

        return aValue > bValue ? 1 : -1;
      });
    }

    return Promise.resolve(top ? filteredItems.slice(0, top) : filteredItems);
  }

  public async createListItem(value: any): Promise<any> {
    return Promise.resolve({ Id: 4, ...value });
  }
}

export { ListService };
