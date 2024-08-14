import { TabsProps } from '@mui/material';

interface ITabSchema {
  fieldToMatch: string;
  label: string;
  stringToMatch: string;
  displayFields: string[];
  disabled?: boolean;
  color: TabsProps['color'];
}

export type { ITabSchema };
