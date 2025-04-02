import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BoxProps } from '@mui/material';
import { IFile } from '@pnp/sp/files';
import { IPropertyFieldList } from '@pnp/spfx-property-controls';

interface IExplorerProps {
  context: WebPartContext;
  library: IPropertyFieldList;
  defaultDisplayType?: 'grid' | 'list';
  height?: BoxProps['height'];
  onFileOpen?: (file: IFile) => void;
}

export type { IExplorerProps };
