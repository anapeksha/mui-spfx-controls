import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  AutocompleteProps,
  ChipOwnProps,
  TextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { CSSProperties, ReactNode } from 'react';

/**
 * Base properties for the Autocomplete component in ListItemPicker.
 */
type AutocompleteBaseProps = AutocompleteProps<any, boolean, boolean, true>;

/**
 * Base properties for the ListItemPicker component.
 */
interface IListItemPickerBaseProps {
  /** SharePoint WebPart context */
  context: WebPartContext;
  /** Label for the input field */
  label: string;
  /** SharePoint list to fetch items from */
  list: string;
  /** Fields to retrieve from the list */
  fields: string[];
  /** Field to display in the picker */
  displayField: string;
  /** Whether multiple selection is allowed */
  multiple?: boolean;
  /** Whether selection is required */
  required?: boolean;
  /** Maximum number of search suggestions */
  searchSuggestionLimit?: number;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Variant of the text field */
  variant?: TextFieldVariants;
  /** Variant of the selected tag */
  tagVariant?: ChipOwnProps['variant'];
  /** Color of the text field */
  color?: TextFieldProps['color'];
  /** Size of the autocomplete input */
  size?: AutocompleteBaseProps['size'];
  /** Custom inline styles */
  styles?: CSSProperties;
  /** MUI system styling (sx prop) */
  sx?: AutocompleteBaseProps['sx'];
  /** Name attribute for the input field */
  name?: TextFieldProps['name'];
  /** Whether the input field takes the full width */
  fullWidth?: TextFieldProps['fullWidth'];
  /** Custom loading component */
  LoadingComponent?: ReactNode;
}

/**
 * Properties for ListItemPicker when multiple values are selected.
 */
interface ISingleValueProps extends IListItemPickerBaseProps {
  /** Enables multiple selection */
  multiple: true;
  /** Default selected values */
  defaultValue?: any[];
  /** Callback triggered when selection changes */
  onSelectionChange?: (value: any[]) => void;
}

/**
 * Properties for ListItemPicker when a single value is selected.
 */
interface IMultiValueProps extends IListItemPickerBaseProps {
  /** Disables multiple selection */
  multiple?: false;
  /** Default selected value */
  defaultValue?: any;
  /** Callback triggered when selection changes */
  onSelectionChange?: (value: any) => void;
}

/**
 * Type definition for ListItemPicker props.
 * Supports both single and multiple selection modes.
 */
export type IListItemPickerProps = ISingleValueProps | IMultiValueProps;
