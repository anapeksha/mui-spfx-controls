import { SimpleTreeViewProps, TreeItemProps } from '@mui/x-tree-view';

type TreeViewBaseProps = SimpleTreeViewProps<false>;

type TreeItemBaseProps = Omit<
  TreeItemProps,
  'onClick' | 'itemId' | 'label' | 'key'
>;

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
  linkTarget?: string;
}

export type { INavigationModel, INavigationProps };
