import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BoxProps } from '@mui/material';
import { IPropertyFieldList } from '@pnp/spfx-property-controls';

/**
 * Represents a breadcrumb item in the Explorer component.
 */
interface IBreadcrumbData {
  /** The display name of the folder or file. */
  Name: string;
  /** The server-relative URL of the folder or file. */
  ServerRelativeUrl: string;
}

/**
 * Props for the Explorer component.
 */
interface IExplorerProps {
  /** The SPFx web part context. */
  context: WebPartContext;
  /** The document library to display. */
  library: IPropertyFieldList;
  /** The default display type for items: 'grid' or 'list'. */
  defaultDisplayType?: 'grid' | 'list';
  /** The height of the Explorer component. */
  height?: BoxProps['height'];
  /**
   * Callback when a file is opened.
   * @param file The breadcrumb data for the opened file.
   */
  onFileOpen?: (file: IBreadcrumbData) => void;
}

export type { IBreadcrumbData, IExplorerProps };
