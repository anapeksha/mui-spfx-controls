import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BreadcrumbsProps } from '@mui/material';
import { ReactNode } from 'react';
import { LinkItem } from '../../services/SiteService';

interface ISiteBreadcrumbProps extends BreadcrumbsProps {
  /**
   * Webpart Context
   */
  context: WebPartContext;

  /**
   * Render first breadcrumb
   */
  renderFirstItem?: (data: LinkItem) => ReactNode;
  /**
   * Render other breadcrumbs
   */
  renderItem?: (data: LinkItem) => ReactNode;
  /**
   * Render last breadcrumb
   */
  renderLastItem?: (data: LinkItem) => ReactNode;
}

export type { ISiteBreadcrumbProps };
