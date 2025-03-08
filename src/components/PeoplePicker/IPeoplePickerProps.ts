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

interface IPeoplePickerEntity extends IBasePeoplePickerEntity {
  Image: string;
}

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
  sx?: AutocompleteBaseProps['sx'];
  name?: TextFieldProps['name'];
  fullWidth?: TextFieldProps['fullWidth'];
  LoadingComponent?: ReactNode;
}

interface ISingleValueProps extends IPeoplePickerBaseProps {
  multiple: true;
  defaultValue?: IPeoplePickerEntity[];
  onSelectionChange?: (value: IPeoplePickerEntity[]) => void;
}

interface IMultiValueProps extends IPeoplePickerBaseProps {
  multiple?: false;
  defaultValue?: IPeoplePickerEntity;
  onSelectionChange?: (value: IPeoplePickerEntity) => void;
}

export type IPeoplePickerProps = ISingleValueProps | IMultiValueProps;
