import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BreadcrumbsProps } from '@mui/material';
import { ReactNode } from 'react';

/**
 * Represents an individual breadcrumb link item.
 */
interface ILinkItem {
  /** Unique identifier for the breadcrumb item */
  key: string;
  /** Display label for the breadcrumb item */
  label: string;
  /** URL the breadcrumb item links to */
  href: string;
}

/**
 * Properties for the SiteBreadcrumb component.
 */
interface ISiteBreadcrumbProps extends BreadcrumbsProps {
  /** SharePoint WebPart context */
  context: WebPartContext;

  /** Custom render function for the first breadcrumb item */
  renderFirstItem?: (data: ILinkItem) => ReactNode;
  /** Custom render function for intermediate breadcrumb items */
  renderItem?: (data: ILinkItem) => ReactNode;
  /** Custom render function for the last breadcrumb item */
  renderLastItem?: (data: ILinkItem) => ReactNode;
}

export type { ILinkItem, ISiteBreadcrumbProps };
