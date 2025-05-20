import { ThemeProvider } from '@emotion/react';
import React from 'react';
import {
  ISiteBreadcrumbProps,
  SiteBreadcrumb,
} from '../../components/SiteBreadcrumb';
import { theme } from '../../config/theme.config';

const SiteBreadcrumbDisplay: React.FC<ISiteBreadcrumbProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <SiteBreadcrumb {...props} />
    </ThemeProvider>
  );
};
export default SiteBreadcrumbDisplay;
