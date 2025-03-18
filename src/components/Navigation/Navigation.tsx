import * as React from 'react';

import { SimpleTreeView, TreeItem, type TreeItemProps } from '@mui/x-tree-view';
import { FC, ReactNode } from 'react';
import type { INavigationModel, INavigationProps } from './INavigationProps';

const renderTree = (
  item: INavigationModel,
  target?: string,
  props?: Omit<TreeItemProps, 'onClick' | 'itemId' | 'label' | 'key'>
): ReactNode => (
  <TreeItem
    {...props}
    key={item.id}
    itemId={item.id}
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
    <SimpleTreeView {...viewProps} data-testid="mui-spfx-navigation">
      {items.map((item) => renderTree(item, linkTarget, itemProps))}
    </SimpleTreeView>
  );
};

export default Navigation;
