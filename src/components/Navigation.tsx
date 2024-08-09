import * as React from 'react';

import { FC, ReactNode } from 'react';
import { INavigationProps } from '../types';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import { INavigationModel } from '../types';

const renderTree = (item: INavigationModel): ReactNode => (
  <TreeItem key={item.id} nodeId={item.id} label={item.label}>
    {item.children?.map((child) => renderTree(child))}
  </TreeItem>
);

export const Navigation: FC<INavigationProps> = ({
  items,
  collapseIcon,
  expandIcon,
  sx,
}) => {
  return (
    <TreeView
      defaultCollapseIcon={collapseIcon || <KeyboardArrowDown />}
      defaultExpandIcon={expandIcon || <KeyboardArrowRight />}
      sx={sx}
    >
      {items.map((item) => renderTree(item))}
    </TreeView>
  );
};

export default Navigation;
