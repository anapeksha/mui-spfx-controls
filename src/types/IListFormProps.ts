import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GridProps, PaperProps, TextFieldProps } from '@mui/material';

interface IListFormProps {
  context: WebPartContext;
  list: string;
  fields: string[];
  onSave?: (formData: Record<string, any>) => void;
  onCancel?: () => void;
  paperVariant?: PaperProps['variant'];
  paperElevation?: PaperProps['elevation'];
  inputVariant?: TextFieldProps['variant'];
  inputSize?: TextFieldProps['size'];
  fieldSpacing?: GridProps['spacing'];
}

export type { IListFormProps };
