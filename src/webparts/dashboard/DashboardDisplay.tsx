import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { Dashboard, type IDashboardProps } from '../../components';
import { theme } from '../../config';

const DashboardDisplay: React.FC<IDashboardProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard {...props} />
    </ThemeProvider>
  );
};

export default DashboardDisplay;
