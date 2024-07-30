import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import { IList, IListInfo } from '@pnp/sp/lists';
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
  public async createListItem(value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.list.items
        .add(value)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export { ListService };
