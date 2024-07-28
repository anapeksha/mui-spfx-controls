import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  AutocompleteProps,
  ChipOwnProps,
  TextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { CSSProperties, ReactNode } from 'react';
import { IExtendedPeoplePickerEntity } from './IExtendedPeoplePicker';

type AutocompleteBaseProps = AutocompleteProps<
  IExtendedPeoplePickerEntity | IExtendedPeoplePickerEntity[],
  boolean,
  boolean,
  true
>;

interface IPeoplePickerBaseProps {
  context: WebPartContext;
  label: string;
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
  styles?: CSSProperties;
  sx?: AutocompleteBaseProps['sx'];
  name?: TextFieldProps['name'];
  fullWidth?: TextFieldProps['fullWidth'];
  LoadingComponent?: ReactNode;
}

interface ISingleValueProps extends IPeoplePickerBaseProps {
  multiple: true;
  defaultValue?: IExtendedPeoplePickerEntity[];
  onSelectionChange?: (value: IExtendedPeoplePickerEntity[]) => void;
}

interface IMultiValueProps extends IPeoplePickerBaseProps {
  multiple?: false;
  defaultValue?: IExtendedPeoplePickerEntity;
  onSelectionChange?: (value: IExtendedPeoplePickerEntity) => void;
}

export type IPeoplePickerProps = ISingleValueProps | IMultiValueProps;
