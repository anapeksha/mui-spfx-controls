import { WebPartContext } from '@microsoft/sp-webpart-base';
import { AutocompleteChangeReason } from '@mui/material';
import { ISearchResult } from '@pnp/sp/search';

interface ISearchBarProps {
  label?: string;
  fullWidth?: boolean;
  required?: boolean;
  context: WebPartContext;
  onSearchResultSelect?: (
    result: ISearchResult | null,
    reason: AutocompleteChangeReason
  ) => void;
}

export type { ISearchBarProps };
