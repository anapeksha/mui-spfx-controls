import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { Dashboard, type IDashboardProps } from '../../components/Dashboard';
import { theme } from '../../config/theme.config';

const DashboardDisplay: React.FC<IDashboardProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard {...props} />
    </ThemeProvider>
  );
};

export default DashboardDisplay;
