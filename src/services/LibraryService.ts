import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import '@pnp/sp/files';
import '@pnp/sp/folders';
import { getSp } from '../config/pnp.config';

/**
 * Service class for interacting with SharePoint Document Libraries.
 */
class LibraryService {
  private readonly sp: SPFI;

  /**
   * Initializes the DocumentLibraryService instance.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   * @param {string} libraryName - The name of the document library.
   */
  constructor(context: WebPartContext) {
    this.sp = getSp(context);
  }

  /**
   * Fetches all folders, and files from the library.
   * @param {string} folderPath - The traversed library path.
   * @returns {Promise<any[]>} A list of items (folders & files).
   */
  public async getLibraryItems(folderPath: string): Promise<any[]> {
    try {
      const libraryRoot = this.sp.web.getFolderByServerRelativePath(folderPath);
      const files = await libraryRoot.files.select('*')();
      const folders = await libraryRoot.folders.select('*')();

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
    } catch (error) {
      console.error('Error fetching document library items:', error);
      return [];
    }
  }
}

export { LibraryService };
