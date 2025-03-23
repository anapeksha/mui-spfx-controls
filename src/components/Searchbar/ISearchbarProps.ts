import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  AutocompleteChangeReason,
  AutocompleteProps,
  TextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { ISearchResult } from '@pnp/sp/search';

/**
 * Base properties for the Autocomplete component in Searchbar.
 */
type AutocompleteBaseProps = AutocompleteProps<
  ISearchResult | ISearchResult[],
  boolean,
  boolean,
  true
>;

/**
 * Properties for the Searchbar component.
 */
interface ISearchbarProps {
  /** Label for the search input field */
  label?: string;
  /** Whether the search bar takes the full width */
  fullWidth?: boolean;
  /** Size of the input field */
  size?: AutocompleteBaseProps['size'];
  /** Color of the input field */
  color?: TextFieldProps['color'];
  /** Variant of the text field */
  variant?: TextFieldVariants;
  /** Scope for filtering search results */
  scope?: string;
  /** Scope to be excluded from search results */
  excludedScope?: string;
  /** MUI system styling (sx prop) */
  sx?: AutocompleteBaseProps['sx'];
  /** SharePoint WebPart context */
  context: WebPartContext;
  /** Callback function triggered when a search result is selected */
  onSearchResultSelect?: (
    result: ISearchResult | null,
    reason: AutocompleteChangeReason
  ) => void;
}

export type { AutocompleteBaseProps, ISearchbarProps };
