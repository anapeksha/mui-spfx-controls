import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  AutocompleteProps,
  ChipOwnProps,
  TextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { CSSProperties, ReactNode } from 'react';

type AutocompleteBaseProps = AutocompleteProps<any, boolean, boolean, true>;

interface IListItemPickerBaseProps {
  context: WebPartContext;
  label: string;
  list: string;
  fields: string[];
  displayField: string;
  multiple?: boolean;
  required?: boolean;
  searchSuggestionLimit?: number;
  disabled?: boolean;
  variant?: TextFieldVariants;
  tagVariant?: ChipOwnProps['variant'];
  color?: TextFieldProps['color'];
  size?: AutocompleteBaseProps['size'];
  styles?: CSSProperties;
  sx?: AutocompleteBaseProps['sx'];
  name?: TextFieldProps['name'];
  fullWidth?: TextFieldProps['fullWidth'];
  LoadingComponent?: ReactNode;
}

interface ISingleValueProps extends IListItemPickerBaseProps {
  multiple: true;
  defaultValue?: any[];
  onSelectionChange?: (value: any[]) => void;
}

interface IMultiValueProps extends IListItemPickerBaseProps {
  multiple?: false;
  defaultValue?: any;
  onSelectionChange?: (value: any) => void;
}

export type IListItemPickerProps = ISingleValueProps | IMultiValueProps;
