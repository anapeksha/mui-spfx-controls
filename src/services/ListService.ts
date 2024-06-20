import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import { IList } from '@pnp/sp/lists';
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
  public async getListItems(
    fields: IFieldInfo[],
    page: number,
    pageSize: number
  ): Promise<any[]> {
    const selectFields: string[] = ['Id'];
    const expandFields: string[] = [];
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
    return new Promise((resolve, reject) => {
      this.list.items
        .select(...selectFields)
        .expand(...expandFields)
        .orderBy('Created', false)
        .top(pageSize)()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
}

export { ListService };
