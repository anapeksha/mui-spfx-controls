import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import '@pnp/sp/files';
import '@pnp/sp/folders';
import { IFolder } from '@pnp/sp/folders';
import { PermissionKind } from '@pnp/sp/security';
import { getSp } from '../config/pnp.config';

export enum Permission {
  View = 'View',
  Add = 'Add',
  Edit = 'Edit',
  Delete = 'Delete',
  ManagePermissions = 'ManagePermissions',
}

/**
 * Service class for interacting with SharePoint Document Libraries.
 */
class LibraryService {
  private readonly sp: SPFI;

  /**
   * Initializes the DocumentLibraryService instance.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   */
  constructor(context: WebPartContext) {
    this.sp = getSp(context);
  }

  /**
   * Retrieves the current user's effective permissions for the specified SharePoint document library.
   *
   * @param {string} id - The id of the document library.
   * @returns {Promise<Permission[]>} A promise that resolves to an array of the user's effective permissions.
   */
  public async getEffectivePermissions(id: string): Promise<Permission[]> {
    const permissions = await this.sp.web.lists
      .getById(id)
      .getCurrentUserEffectivePermissions();

    const userPermissions: Permission[] = [];

    if (this.sp.web.hasPermissions(permissions, PermissionKind.ViewListItems)) {
      userPermissions.push(Permission.View);
    }
    if (this.sp.web.hasPermissions(permissions, PermissionKind.AddListItems)) {
      userPermissions.push(Permission.Add);
    }
    if (this.sp.web.hasPermissions(permissions, PermissionKind.EditListItems)) {
      userPermissions.push(Permission.Edit);
    }
    if (
      this.sp.web.hasPermissions(permissions, PermissionKind.DeleteListItems)
    ) {
      userPermissions.push(Permission.Delete);
    }
    if (
      this.sp.web.hasPermissions(permissions, PermissionKind.ManagePermissions)
    ) {
      userPermissions.push(Permission.ManagePermissions);
    }

    return userPermissions;
  }

  /**
   * Creates a new folder inside the specified SharePoint document library path.
   *
   * @param {string} path - The server-relative path of the parent folder where the new folder should be created.
   * @param {string} name - The name of the new folder.
   * @returns {Promise<IFolder>} A promise that resolves to the created folder object.
   */
  public async createNewFolder(path: string, name: string): Promise<IFolder> {
    const libraryRoot = this.sp.web.getFolderByServerRelativePath(path);
    return await libraryRoot.addSubFolderUsingPath(name);
  }

  /**
   * Fetches all folders, and files from the library.
   * @param {string} path - The traversed library path.
   * @returns {Promise<any[]>} A list of items (folders & files).
   */
  public async getLibraryItems(path: string): Promise<any[]> {
    const libraryRoot = this.sp.web.getFolderByServerRelativePath(path);
    const files = await libraryRoot.files
      .select('ListItemAllFields/Id', '*')
      .expand('ListItemAllFields')();
    const folders = await libraryRoot.folders
      .select('ListItemAllFields/Id', '*')
      .expand('ListItemAllFields')();

    return [
      ...folders.map((folder) => ({ ...folder, Type: 'folder' })),
      ...files.map((file) => ({
        ...file,
        Type: 'file',
        Extension: file.Name.includes('.')
          ? file.Name.split('.').pop()
          : 'unknown',
      })),
    ];
  }

  /**
   * Deletes items (files or folders) from a SharePoint document library.
   * @param {string} listId - The ID of the SharePoint library.
   * @param {number[]} itemIds - The array of item IDs to delete.
   * @returns {Promise<any[]>} void
   */
  public async recycleItems(listId: string, itemIds: number[]): Promise<any[]> {
    const [batched, execute] = this.sp.batched();
    const list = batched.web.lists.getById(listId);
    const res: any[] = [];

    itemIds.forEach(async (id) => {
      res.push(list.items.getById(Number(id)).recycle());
    });

    await execute();

    return res;
  }
}

export { LibraryService };
