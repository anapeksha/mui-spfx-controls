import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  Grid2Props as GridProps,
  PaperProps,
  TextFieldProps,
} from '@mui/material';

type ResponsiveFieldType = {
  name: string;
  size: GridProps['size'];
};

interface IListFormProps {
  context: WebPartContext;
  list: string;
  fields: string[];
  onSave: (formData: Record<string, any>) => void;
  onCancel: () => void;
  label?: string;
  paperVariant?: PaperProps['variant'];
  paperElevation?: PaperProps['elevation'];
  inputVariant?: TextFieldProps['variant'];
  inputSize?: TextFieldProps['size'];
  fieldSpacing?: GridProps['spacing'];
  responsive?: ResponsiveFieldType[];
}

export type { IListFormProps, ResponsiveFieldType };
