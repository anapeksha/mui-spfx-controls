import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  AutocompleteProps,
  ChipOwnProps,
  TextFieldProps,
  TextFieldVariants,
} from '@mui/material';
import { PrincipalSource, PrincipalType } from '@pnp/sp';
import { IPeoplePickerEntity as IBasePeoplePickerEntity } from '@pnp/sp/profiles';
import { ReactNode } from 'react';

/**
 * Base properties for the Autocomplete component in PeoplePicker.
 */
type AutocompleteBaseProps = AutocompleteProps<
  IPeoplePickerEntity | IPeoplePickerEntity[],
  boolean,
  boolean,
  true
>;

/**
 * Extended People Picker entity that includes an image field.
 */
export interface IPeoplePickerEntity extends IBasePeoplePickerEntity {
  /** Image URL associated with the person */
  Image: string;
}

/**
 * Base properties for the PeoplePicker component.
 */
interface IPeoplePickerBaseProps {
  /** SharePoint WebPart context */
  context: WebPartContext;
  /** Label for the PeoplePicker input */
  label?: string;
  /** Whether multiple people can be selected */
  multiple?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Maximum number of suggestions displayed */
  searchSuggestionLimit?: number;
  /** Maximum number of people that can be selected */
  personSelectionLimit?: number;
  /** The source from which people or groups are retrieved */
  principalSource?: PrincipalSource;
  /** Specifies the type of principal (user, security group, distribution list, etc.) to retrieve */
  principalType?: PrincipalType;
  /** Whether the component is in a loading state */
  loading?: boolean;
  /** Whether the PeoplePicker is disabled */
  disabled?: boolean;
  /** Variant of the text field */
  variant?: TextFieldVariants;
  /** Custom render function for the input field */
  renderInput?: AutocompleteBaseProps['renderInput'];
  /** Variant of the selected tag */
  tagVariant?: ChipOwnProps['variant'];
  /** Color of the text field */
  color?: TextFieldProps['color'];
  /** Color of the selected tag */
  tagColor?: ChipOwnProps['color'];
  /** Size of the input field */
  size?: AutocompleteBaseProps['size'];
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
 * Properties for the PeoplePicker component.
 * Supports both single and multiple selection modes.
 */
export interface IPeoplePickerProps extends IPeoplePickerBaseProps {
  /** Enables multiple selection */
  multiple?: boolean;
  /** Current selected value(s) */
  value?: IPeoplePickerEntity | IPeoplePickerEntity[];
  /** Default selected value(s) */
  defaultValue?: IPeoplePickerEntity | IPeoplePickerEntity[];
  /** Callback function triggered when selection changes */
  onChange?: (value: IPeoplePickerEntity | IPeoplePickerEntity[]) => void;
}
