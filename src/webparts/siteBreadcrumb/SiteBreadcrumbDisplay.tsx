import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { ISiteBreadcrumbProps, SiteBreadcrumb } from '../../components';
import { theme } from '../../config';

const SiteBreadcrumbDisplay: React.FC<ISiteBreadcrumbProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <SiteBreadcrumb {...props} />
    </ThemeProvider>
  );
};
export default SiteBreadcrumbDisplay;
