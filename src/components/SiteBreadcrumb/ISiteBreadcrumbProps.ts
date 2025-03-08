import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BreadcrumbsProps } from '@mui/material';

interface ISiteBreadcrumbProps extends BreadcrumbsProps {
  context: WebPartContext;
}

export type { ISiteBreadcrumbProps };
