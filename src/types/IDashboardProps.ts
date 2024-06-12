import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BoxProps } from '@mui/material';
import { DataGridProps } from '@mui/x-data-grid';

interface IDashboardProps {
  context: WebPartContext;
  list: string;
  fields: string[];
  height?: BoxProps['height'];
  sx?: DataGridProps['sx'];
}

export type { IDashboardProps };
