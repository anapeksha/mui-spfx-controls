import { SimpleTreeViewProps, TreeItemProps } from '@mui/x-tree-view';

/**
 * Base properties for the SimpleTreeView component.
 */
type TreeViewBaseProps = SimpleTreeViewProps<false>;

/**
 * Base properties for a TreeItem, excluding specific event handlers.
 */
type TreeItemBaseProps = Omit<
  TreeItemProps,
  'onClick' | 'itemId' | 'label' | 'key'
>;

/**
 * Base interface for a navigation item.
 */
interface IBaseNavigationModel {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label for the navigation item */
  label: string;
}

/**
 * Navigation model for an item without children.
 */
interface INavigationModelWithoutChildren extends IBaseNavigationModel {
  /** Navigation items without children do not have a children property */
  children?: never;
  /** Link associated with the navigation item */
  link?: string;
}

/**
 * Navigation model for an item with children.
 */
interface INavigationModelWithChildren extends IBaseNavigationModel {
  /** Nested navigation items */
  children: [INavigationModel, ...INavigationModel[]];
  /** Items with children do not have a link property */
  link?: never;
}

/**
 * Type representing a navigation model, which can either have children or be a standalone link.
 */
type INavigationModel =
  | INavigationModelWithChildren
  | INavigationModelWithoutChildren;

/**
 * Properties for the Navigation component.
 */
interface INavigationProps {
  /** List of navigation items */
  items: INavigationModel[];
  /** Additional properties for tree items */
  itemProps?: TreeItemBaseProps;
  /** Additional properties for the tree view */
  viewProps?: TreeViewBaseProps;
  /** Target attribute for links (e.g., _blank, _self) */
  linkTarget?: string;
}

export type { INavigationModel, INavigationProps };
