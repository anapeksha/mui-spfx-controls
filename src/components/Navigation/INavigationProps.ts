import { BoxProps } from '@mui/material';
import { TreeItemProps, TreeViewProps } from '@mui/x-tree-view';
import { INavigationModel } from '../INavigationModel';

type TreeViewBaseProps = TreeViewProps<false>;

type TreeItemBaseProps = Omit<TreeItemProps, 'onClick' | 'nodeId' | 'label'>;

interface INavigationProps {
  items: INavigationModel[];
  itemProps?: TreeItemBaseProps;
  viewProps?: TreeViewBaseProps;
  sx?: BoxProps['sx'];
}

export type { INavigationProps };
