import * as React from 'react';

import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Link,
} from '@mui/icons-material';
import { TreeItem, TreeView, type TreeItemProps } from '@mui/x-tree-view';
import { FC, ReactNode } from 'react';
import type { INavigationModel, INavigationProps } from './INavigationProps';

const renderTree = (
  item: INavigationModel,
  target?: string,
  props?: Omit<TreeItemProps, 'onClick' | 'nodeId' | 'label'>
): ReactNode => (
  <TreeItem
    {...props}
    key={item.id}
    nodeId={item.id}
    label={item.label}
    onClick={
      item.children ? undefined : () => window.open(new URL(item.link!), target)
    }
  >
    {item.children?.map((child) => renderTree(child, target, props))}
  </TreeItem>
);

export const Navigation: FC<INavigationProps> = ({
  items,
  itemProps,
  viewProps,
  linkTarget,
}) => {
  return (
    <TreeView
      defaultCollapseIcon={
        viewProps?.defaultCollapseIcon || <KeyboardArrowDown color="primary" />
      }
      defaultExpandIcon={
        viewProps?.defaultExpandIcon || <KeyboardArrowRight color="primary" />
      }
      defaultEndIcon={viewProps?.defaultEndIcon || <Link color="primary" />}
      {...viewProps}
    >
      {items.map((item) => renderTree(item, linkTarget, itemProps))}
    </TreeView>
  );
};

export default Navigation;
