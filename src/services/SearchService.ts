import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { SearchResults } from '@pnp/sp/search';
import { getSp } from '../config/pnp.config';

/**
 * Service class for performing search queries in SharePoint.
 */
class SearchService {
  private sp: SPFI;

  /**
   * Initializes the SearchService instance.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   */
  constructor(context: WebPartContext) {
    this.sp = getSp(context);
  }

  /**
   * Executes a search query against SharePoint.
   * @param {string} query - The search query string.
   * @param {number} searchLimit - The maximum number of search results to return.
   * @returns {Promise<SearchResults>} The search results.
   */
  public async search(
    query: string,
    searchLimit: number
  ): Promise<SearchResults> {
    return await this.sp.search({
      QueryTemplate: query,
      RowLimit: searchLimit,
      EnableInterleaving: true,
      TrimDuplicates: true,
    });
  }
}

export { SearchService };
