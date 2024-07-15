import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import { IList } from '@pnp/sp/lists';
import { PermissionKind } from '@pnp/sp/security';
import { getSP } from '../config';

class ListService {
  private sp: SPFI;
  private list: IList;
  private batchedList: IList;
  private batchedSp: [SPFI, () => Promise<void>];
  constructor(context: WebPartContext, listId: string) {
    this.sp = getSP(context);
    this.list = this.sp.web.lists.getById(listId);
    this.batchedSp = this.sp.batched();
    this.batchedList = this.batchedSp[0].web.lists.getById(listId);
  }
  private checkCustomFieldType(field: IFieldInfo): boolean {
    return !field.Hidden;
  }
  private getListSize(): Promise<number> {
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
  public async getListFields(
    fieldInternalNames: string[]
  ): Promise<IFieldInfo[]> {
    return new Promise((resolve, reject) => {
      this.list
        .fields()
        .then((response) => {
          resolve(
            response.filter(
              (value) =>
                this.checkCustomFieldType(value) &&
                fieldInternalNames.indexOf(value.InternalName) !== -1
            )
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public async getListItems(fields: IFieldInfo[]): Promise<any[]> {
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
    for await (const items of this.list.items
      .select(...selectFields)
      .expand(...expandFields)
      .orderBy('Created', false) as any) {
      if (totalItems.length >= totalCount) {
        break;
      } else {
        totalItems.push(...items);
      }
    }
    return totalItems;
  }
  public checkListPermission(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.list
        .currentUserHasPermissions(PermissionKind.EditListItems)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public async batchedUpdateListItems(
    items: Record<any, any>[]
  ): Promise<string> {
    if (items.length !== 0) {
      const execute = this.batchedSp[1];
      const batchedRes: any[] = [];
      const cleanedItems: any[] = items.map((value) => {
        return Object.keys(value)
          .filter((key) => !key.indexOf('odata'))
          .reduce((obj: any, key) => {
            obj[key] = value[key];
            return obj;
          });
      });
      console.log(cleanedItems);
      items.forEach(async (value) => {
        const response = await this.batchedList.items
          .getById(value.Id)
          .update(value);
        batchedRes.push(response);
      });
      await execute();
      return 'Done';
    } else {
      return 'Empty';
    }
  }
}

export { ListService };
