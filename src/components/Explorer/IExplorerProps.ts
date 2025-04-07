import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BoxProps } from '@mui/material';
import { IPropertyFieldList } from '@pnp/spfx-property-controls';

interface IBreadcrumbData {
  Name: string;
  ServerRelativeUrl: string;
}

interface IExplorerProps {
  context: WebPartContext;
  library: IPropertyFieldList;
  defaultDisplayType?: 'grid' | 'list';
  height?: BoxProps['height'];
  onFileOpen?: (file: IBreadcrumbData) => void;
}

export type { IBreadcrumbData, IExplorerProps };
