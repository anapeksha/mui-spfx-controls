import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BoxProps } from '@mui/material';
import { IPropertyFieldList } from '@pnp/spfx-property-controls';

interface IExplorerProps {
  context: WebPartContext;
  library: IPropertyFieldList;
  height?: BoxProps['height'];
}

export type { IExplorerProps };
