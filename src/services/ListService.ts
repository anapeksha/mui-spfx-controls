import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Logger } from '@pnp/logging';
import { SPFI } from '@pnp/sp';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import { IList, IListInfo } from '@pnp/sp/lists';
import { PermissionKind } from '@pnp/sp/security';
import { getSp } from '../config/pnp.config';

/**
 * Service class for interacting with SharePoint lists.
 */
class ListService {
  private readonly sp: SPFI;
  private readonly list: IList;

  /**
   * Initializes the ListService instance.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   * @param {string} listId - The ID of the SharePoint list.
   */
  constructor(context: WebPartContext, listId: string) {
    this.sp = getSp(context);
    this.list = this.sp.web.lists.getById(listId);
  }

  /**
   * Checks if a field is visible and not hidden.
   * @param {IFieldInfo} field - The field information.
   * @returns {boolean} True if the field is not hidden, otherwise false.
   */
  private checkCustomFieldType(field: IFieldInfo): boolean {
    return !field.Hidden;
  }

  /**
   * Retrieves the total item count of the list.
   * @returns {Promise<number>} The total number of items in the list.
   */
  private async getListSize(): Promise<number> {
    return this.list
      .select('ItemCount')()
      .then((response) => response.ItemCount);
  }

  /**
   * Fetches all lists available in the SharePoint site.
   * @returns {Promise<IListInfo[]>} A list of SharePoint lists.
   */
  public async getLists(): Promise<IListInfo[]> {
    return this.sp.web.lists();
  }

  /**
   * Retrieves fields from the specified list, optionally filtering by internal names.
   * @param {string[]} [fieldInternalNames] - Optional array of field internal names to filter.
   * @returns {Promise<IFieldInfo[]>} A list of field information objects.
   */
  public async getListFields(
    fieldInternalNames?: string[]
  ): Promise<IFieldInfo[]> {
    return this.list
      .fields()
      .then((response) =>
        response.filter((value) =>
          fieldInternalNames
            ? this.checkCustomFieldType(value) &&
              fieldInternalNames.indexOf(value.InternalName) !== -1
            : this.checkCustomFieldType(value)
        )
      );
  }

  /**
   * Retrieves list items with specified fields, filters, and sorting options.
   * @param {IFieldInfo[]} fields - The fields to include.
   * @param {string} [filter] - Optional OData filter query.
   * @param {string} [orderBy] - Optional sorting field.
   * @param {number} [top] - Optional limit on number of records.
   * @returns {Promise<any[]>} The list items.
   */
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
        selectFields.push(
          `${value.InternalName}/Id`,
          `${value.InternalName}/Title`,
          `${value.InternalName}/EMail`
        );
        expandFields.push(value.InternalName);
      } else {
        selectFields.push(value.InternalName);
      }
    });

    const totalCount = await this.getListSize();
    if (top) {
      totalItems.push(
        ...(await this.list.items
          .select(...selectFields)
          .expand(...expandFields)
          .filter(filter ?? '')
          .orderBy(orderBy ?? '', false)
          .top(top)())
      );
    } else {
      for await (const items of this.list.items
        .select(...selectFields)
        .expand(...expandFields)
        .filter(filter ?? '')
        .orderBy(orderBy ?? '', false) as any) {
        if (totalItems.length >= totalCount) break;
        totalItems.push(...items);
      }
    }
    return totalItems;
  }

  /**
   * Creates a new list item with specified values.
   * @param {Record<string, any>} value - The values for the new item.
   * @returns {Promise<Record<string, any>>} The created list item.
   * @throws {Error} If the user lacks AddListItems permission.
   */
  public async createListItem(
    value: Record<string, any>
  ): Promise<Record<string, any>> {
    const userPermissions =
      await this.list.getCurrentUserEffectivePermissions();
    if (
      !this.list.hasPermissions(userPermissions, PermissionKind.AddListItems)
    ) {
      throw new Error('Permission Error');
    }
    return await this.list.items.add(value);
  }

  /**
   * Updates an existing list item by ID.
   * @param {number} id - The ID of the list item.
   * @param {Record<string, any>} newRow - The updated values.
   * @returns {Promise<void>} Resolves when the update is successful.
   * @throws {Error} If the user lacks EditListItems permission.
   */
  public async updateListItem(
    id: number,
    newRow: Record<string, any>
  ): Promise<void> {
    const userPermissions =
      await this.list.getCurrentUserEffectivePermissions();
    if (
      !this.list.hasPermissions(userPermissions, PermissionKind.EditListItems)
    ) {
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
    const resolveUserId = async (email: string): Promise<number | null> => {
      try {
        const user = await this.sp.web.siteUsers.getByEmail(email)();
        return user.Id;
      } catch (error) {
        Logger.error(error);
        return null;
      }
    };

    const processedRow: Record<string, any> = {};
    for (const key of Object.keys(newRow)) {
      const value = newRow[key];
      if (!excludedFields.has(key) && key.indexOf('@odata.') !== -1) {
        if (value && typeof value === 'object' && 'EMail' in value) {
          const userId = await resolveUserId(value.EMail);
          if (userId) processedRow[key + 'Id'] = userId;
        } else {
          processedRow[key] = value;
        }
      }
    }
    await this.list.items.getById(id).update(processedRow);
  }
}

export { ListService };
