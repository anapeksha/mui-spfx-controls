import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISearchResult } from '@pnp/sp/search';

interface ISearchBarProps {
  context: WebPartContext;
  onSearchResultSelect?: (result: ISearchResult | null) => void;
  required?: boolean;
}

export type { ISearchBarProps };
