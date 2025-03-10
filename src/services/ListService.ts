import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import { IList, IListInfo } from '@pnp/sp/lists';
import { PermissionKind } from '@pnp/sp/security';
import { getSP } from '../config';

class ListService {
  private sp: SPFI;
  private list: IList;
  constructor(context: WebPartContext, listId: string) {
    this.sp = getSP(context);
    this.list = this.sp.web.lists.getById(listId);
  }

  private checkCustomFieldType(field: IFieldInfo): boolean {
    return !field.Hidden;
  }

  private async getListSize(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.list
        .select('ItemCount')()
        .then((response) => {
          resolve(response.ItemCount);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getLists(): Promise<IListInfo[]> {
    return new Promise((resolve, reject) => {
      this.sp.web
        .lists()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getListFields(
    fieldInternalNames?: string[]
  ): Promise<IFieldInfo[]> {
    return new Promise((resolve, reject) => {
      this.list
        .fields()
        .then((response) => {
          resolve(
            response.filter((value) =>
              fieldInternalNames
                ? this.checkCustomFieldType(value) &&
                  fieldInternalNames.indexOf(value.InternalName) !== -1
                : this.checkCustomFieldType(value)
            )
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getListItems(
    fields: IFieldInfo[],
    filter?: string,
    orderBy?: string,
    top?: number
  ): Promise<any[]> {
    const selectFields: string[] = ['Id'];
    const expandFields: string[] = [];
    const totalItems: any[] = [];
    fields.forEach((value) => {
      if (value.FieldTypeKind === FieldTypes.User) {
        selectFields.push(`${value.InternalName}/Id`);
        selectFields.push(`${value.InternalName}/Title`);
        selectFields.push(`${value.InternalName}/EMail`);
        expandFields.push(value.InternalName);
      } else {
        selectFields.push(value.InternalName);
      }
    });
    const totalCount = await this.getListSize();
    if (top) {
      const tempTotalItems = await this.list.items
        .select(...selectFields)
        .expand(...expandFields)
        .filter(filter ? filter : '')
        .orderBy(orderBy ? orderBy : '', false)
        .top(top)();
      totalItems.push(...tempTotalItems);
    } else {
      for await (const items of this.list.items
        .select(...selectFields)
        .expand(...expandFields)
        .filter(filter ? filter : '')
        .orderBy(orderBy ? orderBy : '', false) as any) {
        if (totalItems.length >= totalCount) {
          break;
        } else {
          totalItems.push(...items);
        }
      }
    }
    return totalItems;
  }

  public async createListItem(
    value: Record<string, any>
  ): Promise<Record<string, any>> {
    const userPermissions =
      await this.list.getCurrentUserEffectivePermissions();

    const hasPermissionToAdd = this.list.hasPermissions(
      userPermissions,
      PermissionKind.AddListItems
    );

    if (!hasPermissionToAdd) {
      throw new Error('Permission Error');
    }
    return await this.list.items.add(value);
  }

  public async updateListItem(
    id: number,
    newRow: Record<string, any>
  ): Promise<void> {
    const userPermissions =
      await this.list.getCurrentUserEffectivePermissions();

    const hasPermissionToEdit = this.list.hasPermissions(
      userPermissions,
      PermissionKind.EditListItems
    );

    if (!hasPermissionToEdit) {
      throw new Error('Permission Error');
    }

    const excludedFields = new Set([
      'ID',
      'Created',
      'Modified',
      'Author',
      'Editor',
      'GUID',
      'Version',
      'Attachments',
      'odata.editLink',
      'odata.id',
      'odata.type',
      'odata.metadata',
      'odata.etag',
    ]);

    const filteredRow = Object.keys(newRow).reduce((acc, key) => {
      if (!excludedFields.has(key)) {
        acc[key] = newRow[key];
      }
      return acc;
    }, {} as Record<string, any>);

    await this.list.items.getById(id).update(filteredRow);
  }
}

export { ListService };
