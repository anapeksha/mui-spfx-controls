import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  AutocompleteProps,
  ChipOwnProps,
  TextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { IPeoplePickerEntity as IBasePeoplePickerEntity } from '@pnp/sp/profiles';
import { ReactNode } from 'react';

type AutocompleteBaseProps = AutocompleteProps<
  IPeoplePickerEntity | IPeoplePickerEntity[],
  boolean,
  boolean,
  true
>;

export interface IPeoplePickerEntity extends IBasePeoplePickerEntity {
  Image: string;
}

interface IPeoplePickerBaseProps {
  context: WebPartContext;
  label?: string;
  multiple?: boolean;
  required?: boolean;
  searchSuggestionLimit?: number;
  personSelectionLimit?: number;
  disabled?: boolean;
  variant?: TextFieldVariants;
  tagVariant?: ChipOwnProps['variant'];
  color?: TextFieldProps['color'];
  tagColor?: ChipOwnProps['color'];
  size?: AutocompleteBaseProps['size'];
  sx?: AutocompleteBaseProps['sx'];
  name?: TextFieldProps['name'];
  fullWidth?: TextFieldProps['fullWidth'];
  LoadingComponent?: ReactNode;
}

export interface IPeoplePickerProps extends IPeoplePickerBaseProps {
  multiple?: boolean;
  value?: IPeoplePickerEntity | IPeoplePickerEntity[];
  defaultValue?: IPeoplePickerEntity | IPeoplePickerEntity[];
  onChange?: (value: IPeoplePickerEntity | IPeoplePickerEntity[]) => void;
}
