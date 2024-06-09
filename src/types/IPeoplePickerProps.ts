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
  IExtendedPeoplePickerEntity,
  boolean,
  boolean,
  true
>;

interface IPeoplePickerProps {
  context: WebPartContext;
  label: string;
  defaultValue?: IExtendedPeoplePickerEntity[];
  onSelectionChange?: (value: IExtendedPeoplePickerEntity[]) => void;
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
  LoadingComponent?: ReactNode;
}

export type { IPeoplePickerProps };
