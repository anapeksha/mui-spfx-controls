import * as React from 'react';

import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Link,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { TreeItem, TreeView, type TreeItemProps } from '@mui/x-tree-view';
import { FC, ReactNode } from 'react';
import type { INavigationModel } from './INavigationModel';
import type { INavigationProps } from './INavigationProps';

const renderTree = (
  item: INavigationModel,
  props?: Omit<TreeItemProps, 'onClick' | 'nodeId' | 'label'>
): ReactNode => (
  <TreeItem
    {...props}
    key={item.id}
    nodeId={item.id}
    label={item.label}
    onClick={() => window.open(new URL(item.link as string))}
  >
    {item.children?.map((child) => renderTree(child, props))}
  </TreeItem>
);

export const Navigation: FC<INavigationProps> = ({
  items,
  itemProps,
  viewProps,
  sx,
}) => {
  return (
    <Box
      sx={
        sx
          ? sx
          : (theme) => {
              return {
                minHeight: 352,
                minWidth: 250,
                border: `2px solid ${theme.palette.primary.main}`,
                backgroundColor: theme.palette.grey[100],
                borderRadius: theme.shape.borderRadius,
              };
            }
      }
    >
      <TreeView
        defaultCollapseIcon={
          viewProps?.defaultCollapseIcon || (
            <KeyboardArrowDown color="primary" />
          )
        }
        defaultExpandIcon={
          viewProps?.defaultExpandIcon || <KeyboardArrowRight color="primary" />
        }
        {...viewProps}
        defaultEndIcon={viewProps?.defaultEndIcon || <Link color="primary" />}
      >
        {items.map((item) => renderTree(item, itemProps))}
      </TreeView>
    </Box>
  );
};

export default Navigation;
