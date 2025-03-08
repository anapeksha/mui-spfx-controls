import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BoxProps } from '@mui/material';
import { DataGridProps } from '@mui/x-data-grid';

import { TabOwnProps } from '@mui/material';

interface ITabSchema
  extends Pick<TabOwnProps, 'disabled' | 'wrapped' | 'icon' | 'iconPosition'> {
  fieldToMatch: string;
  label: string;
  stringToMatch: string;
  displayFields: string[];
}

interface IDashboardBaseProps {
  context: WebPartContext;
  list: string;
  fields: string[];
  columnAction?: boolean;
  densityAction?: boolean;
  filterAction?: boolean;
  exportAction?: boolean;
  searchAction?: boolean;
  height?: BoxProps['height'];
  sx?: DataGridProps['sx'];
}

interface IDashboardTabbedProps extends IDashboardBaseProps {
  tabAction: true;
  tabValue: ITabSchema[];
}

interface IDashboardNotTabbedProps extends IDashboardBaseProps {
  tabAction?: false;
  tabValue: never;
}

type IDashboardProps = IDashboardTabbedProps | IDashboardNotTabbedProps;

export type { IDashboardProps, ITabSchema };
