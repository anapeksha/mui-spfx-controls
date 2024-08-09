import { INavigationModel } from '../INavigationModel';
import { TreeViewProps } from '@mui/x-tree-view';

type TreeViewBaseProps = TreeViewProps<false>;

interface INavigationProps {
  items: INavigationModel[];
  collapseIcon?: TreeViewBaseProps['defaultCollapseIcon'];
  expandIcon?: TreeViewBaseProps['defaultExpandIcon'];
  sx?: TreeViewBaseProps['sx'];
}

export type { INavigationProps };
