import { BoxProps } from '@mui/material';
import { TreeItemProps, TreeViewProps } from '@mui/x-tree-view';

type TreeViewBaseProps = TreeViewProps<false>;

type TreeItemBaseProps = Omit<TreeItemProps, 'onClick' | 'nodeId' | 'label'>;

interface IBaseNavigationModel {
  id: string;
  label: string;
}

interface INavigationModelWithoutChildren extends IBaseNavigationModel {
  children?: never;
  link?: string;
}

interface INavigationModelWithChildren extends IBaseNavigationModel {
  children: [INavigationModel, ...INavigationModel[]];
  link?: never;
}

type INavigationModel =
  | INavigationModelWithChildren
  | INavigationModelWithoutChildren;

interface INavigationProps {
  items: INavigationModel[];
  itemProps?: TreeItemBaseProps;
  viewProps?: TreeViewBaseProps;
  sx?: BoxProps['sx'];
}

export type { INavigationModel, INavigationProps };
