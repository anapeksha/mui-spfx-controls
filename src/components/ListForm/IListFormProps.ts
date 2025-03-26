import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  Grid2Props as GridProps,
  PaperProps,
  TextFieldProps,
} from '@mui/material';

/**
 * Defines the responsive field type used for grid-based layouts.
 */
interface IResponsiveFieldType {
  /**
   * Size of the grid item, following MUI's responsive GridProps['size'] type.
   */
  size: GridProps['size'];
}

/**
 * Props for the ListForm component, responsible for rendering and handling form interactions.
 */
interface IListFormProps {
  /** SharePoint WebPart context */
  context: WebPartContext;
  /** Name of the SharePoint list where data will be saved */
  list: string;
  /** Array of field names to be included in the form */
  fields: string[];
  /** Callback function triggered when the form is saved */
  onSave: (formData: Record<string, any>) => void;
  /** Callback function triggered when the form is cancelled */
  onCancel: () => void;
  /** Optional label for the form */
  label?: string;
  /** Variant style of the form container (MUI Paper component) */
  paperVariant?: PaperProps['variant'];
  /** Elevation level of the form container (MUI Paper component) */
  paperElevation?: PaperProps['elevation'];
  /** Variant style of input fields */
  inputVariant?: TextFieldProps['variant'];
  /** Size of input fields */
  inputSize?: TextFieldProps['size'];
  /** Spacing between fields in the grid layout */
  fieldSpacing?: GridProps['spacing'];
  /** Responsive configuration for field layout */
  responsive?: Record<string, IResponsiveFieldType>;
}

export type { IListFormProps };
