import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { SearchResults } from '@pnp/sp/search';
import { getSP } from '../config';

class SearchService {
  private sp: SPFI;
  constructor(context: WebPartContext) {
    this.sp = getSP(context);
  }

  public async search(
    query: string,
    searchLimit: number
  ): Promise<SearchResults> {
    return new Promise<SearchResults>((resolve, reject) => {
      this.sp
        .search({
          QueryTemplate: query,
          RowLimit: searchLimit,
          EnableInterleaving: true,
          TrimDuplicates: true,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export { SearchService };
