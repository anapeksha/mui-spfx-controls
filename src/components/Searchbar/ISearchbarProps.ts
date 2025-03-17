import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  AutocompleteChangeReason,
  AutocompleteProps,
  TextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { ISearchResult } from '@pnp/sp/search';

type AutocompleteBaseProps = AutocompleteProps<
  ISearchResult | ISearchResult[],
  boolean,
  boolean,
  true
>;

interface ISearchbarProps {
  label?: string;
  fullWidth?: boolean;
  size?: AutocompleteBaseProps['size'];
  color?: TextFieldProps['color'];
  variant?: TextFieldVariants;
  scope?: string;
  excludedScope?: string;
  sx?: AutocompleteBaseProps['sx'];
  context: WebPartContext;
  onSearchResultSelect?: (
    result: ISearchResult | null,
    reason: AutocompleteChangeReason
  ) => void;
}

export type { AutocompleteBaseProps, ISearchbarProps };
