import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BoxProps } from '@mui/material';

interface IDashboardProps {
  context: WebPartContext;
  list: string;
  fields: string[];
  height?: BoxProps['height'];
}

export type { IDashboardProps };
