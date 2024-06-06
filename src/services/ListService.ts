import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { getSP } from '../config';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import { IList } from '@pnp/sp/lists';

class ListService {
  private sp: SPFI;
  private list: IList;
  constructor(context: WebPartContext, listId: string) {
    this.sp = getSP(context);
    this.list = this.sp.web.lists.getById(listId);
  }
  private checkCustomFieldType(field: IFieldInfo): boolean {
    return (field.FieldTypeKind === FieldTypes.Boolean ||
      field.FieldTypeKind === FieldTypes.Choice ||
      field.FieldTypeKind === FieldTypes.Currency ||
      field.FieldTypeKind === FieldTypes.DateTime ||
      field.FieldTypeKind === FieldTypes.Integer ||
      field.FieldTypeKind === FieldTypes.MultiChoice ||
      field.FieldTypeKind === FieldTypes.Text ||
      field.FieldTypeKind === FieldTypes.URL ||
      field.FieldTypeKind === FieldTypes.User) &&
      field.InternalName[0] !== '_'
      ? true
      : false;
  }
  public async getListFields(
    fieldInternalNames: string[]
  ): Promise<IFieldInfo[]> {
    return new Promise((resolve, reject) => {
      this.list
        .fields()
        .then((response) => {
          console.log(
            response.filter((value) => this.checkCustomFieldType(value))
          );
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
  public getListItems(
    fields: IFieldInfo[],
    page?: number,
    pageSize?: number
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
        .orderBy('Title', false)()
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export { ListService };
