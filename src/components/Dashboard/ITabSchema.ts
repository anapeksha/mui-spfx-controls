import { TabOwnProps } from '@mui/material';

interface ITabSchema
  extends Pick<TabOwnProps, 'disabled' | 'wrapped' | 'icon' | 'iconPosition'> {
  fieldToMatch: string;
  label: string;
  stringToMatch: string;
  displayFields: string[];
}

export type { ITabSchema };
