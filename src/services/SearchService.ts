import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { SearchResults } from '@pnp/sp/search';
import { getSp } from '../config/pnp.config';

class SearchService {
  private sp: SPFI;
  constructor(context: WebPartContext) {
    this.sp = getSp(context);
  }

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
