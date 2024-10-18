import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { getSP } from '../config';
import { ISearchResult, SearchResults } from '@pnp/sp/search';

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
          Querytext: query,
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

  public async searchSuggest(
    query: string,
    page: number,
    pageSize: number
  ): Promise<ISearchResult> {
    return new Promise<any>((resolve, reject) => {
      this.sp
        .searchSuggest({
          querytext: query,
          count: 5,
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
