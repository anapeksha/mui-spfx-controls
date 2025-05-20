import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BoxProps, TabOwnProps } from '@mui/material';
import { DataGridProps } from '@mui/x-data-grid';

/**
 * Schema for a tab in the dashboard.
 * Extends selected properties from MUI's TabOwnProps.
 */
interface ITabSchema
  extends Pick<TabOwnProps, 'disabled' | 'wrapped' | 'icon' | 'iconPosition'> {
  /** Field in the dataset to match for tab selection */
  fieldToMatch: string;
  /** Label displayed on the tab */
  label: string;
  /** String value to match against fieldToMatch */
  stringToMatch: string;
  /** Fields to be displayed when the tab is selected */
  displayFields: string[];
}

/**
 * Base properties for the dashboard component.
 */
interface IDashboardBaseProps {
  /** SharePoint WebPart context */
  context: WebPartContext;
  /** Name of the SharePoint list */
  list: string;
  /** Array of field names to display in the dashboard */
  fields: string[];
  /** Whether the grid is editable */
  editable?: boolean;
  /** Whether the columns are resizable */
  resizable?: boolean;
  /** Whether column actions (like sorting) are enabled */
  columnAction?: boolean;
  /** Whether density options (compact, standard, comfortable) are available */
  densityAction?: boolean;
  /** Whether filtering options are available */
  filterAction?: boolean;
  /** Whether export options are available */
  exportAction?: boolean;
  /** Whether search functionality is enabled */
  searchAction?: boolean;
  /** Height of the dashboard component */
  height?: BoxProps['height'];
  /** Custom styling for the dashboard */
  sx?: DataGridProps['sx'];
}

/**
 * Properties for a dashboard with tab functionality.
 */
interface IDashboardTabbedProps extends IDashboardBaseProps {
  /** Enables tab functionality */
  tabAction: true;
  /** Configuration for each tab */
  tabValue: ITabSchema[];
}

/**
 * Properties for a dashboard without tab functionality.
 */
interface IDashboardNotTabbedProps extends IDashboardBaseProps {
  /** Disables tab functionality */
  tabAction?: false;
  /** No tab configuration when tab functionality is disabled */
  tabValue: undefined;
}

/**
 * Type definition for dashboard properties.
 * Supports both tabbed and non-tabbed dashboards.
 */
type IDashboardProps = IDashboardTabbedProps | IDashboardNotTabbedProps;

export type { IDashboardProps, ITabSchema };
