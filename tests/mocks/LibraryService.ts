import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IFolder } from '@pnp/sp/folders';

export enum Permission {
  View = 'View',
  Add = 'Add',
  Edit = 'Edit',
  Delete = 'Delete',
  ManagePermissions = 'ManagePermissions',
}

export const mockedLibraryItems = [
  {
    UniqueId: 'folder-1',
    Name: 'Shared Documents',
    ServerRelativeUrl: '/sites/dev/Shared Documents',
    Type: 'folder',
  },
  {
    UniqueId: 'file-1',
    Name: 'Report.pdf',
    ServerRelativeUrl: '/sites/dev/Shared Documents/Report.pdf',
    Type: 'file',
    Extension: 'pdf',
  },
  {
    UniqueId: 'file-2',
    Name: 'Notes.txt',
    ServerRelativeUrl: '/sites/dev/Shared Documents/Notes.txt',
    Type: 'file',
    Extension: 'txt',
  },
];

const folders = [
  {
    UniqueId: 'folder-1',
    Name: 'Shared Documents',
    ServerRelativeUrl: '/sites/dev/Shared Documents',
    Type: 'folder',
  },
];

const files = [
  {
    UniqueId: 'file-1',
    Name: 'Report.pdf',
    ServerRelativeUrl: '/sites/dev/Shared Documents/Report.pdf',
    Type: 'file',
    Extension: 'pdf',
  },
  {
    UniqueId: 'file-2',
    Name: 'Notes.txt',
    ServerRelativeUrl: '/sites/dev/Shared Documents/Notes.txt',
    Type: 'file',
    Extension: 'txt',
  },
];

export class LibraryService {
  constructor(context: WebPartContext) {}

  /**
   * Returns mock permissions for the current user.
   */
  public async getEffectivePermissions(id: string): Promise<Permission[]> {
    // Always return all permissions for testing
    return [
      Permission.View,
      Permission.Add,
      Permission.Edit,
      Permission.Delete,
      Permission.ManagePermissions,
    ];
  }

  /**
   * Simulates creating a new folder.
   */
  public async createNewFolder(path: string, name: string): Promise<IFolder> {
    const newFolder = {
      UniqueId: `folder-${folders.length + 1}`,
      Name: name,
      ServerRelativeUrl: `${path}/${name}`,
      Type: 'folder',
    };
    folders.push(newFolder);
    return Promise.resolve(newFolder as unknown as IFolder);
  }

  /**
   * Returns all mock folders and files for a given path.
   */
  public async getLibraryItems(path: string): Promise<any[]> {
    // For simplicity, ignore path and return all
    return Promise.resolve([...folders, ...files]);
  }

  /**
   * Simulates recycling (deleting) items by UniqueId.
   */
  public async recycleItems(
    listId: string,
    itemIds: number[] | string[]
  ): Promise<any[]> {
    // Remove items from folders and files arrays
    return Promise.resolve([]);
  }
}
