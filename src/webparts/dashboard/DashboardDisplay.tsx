import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { Dashboard } from '../../components';
import { theme } from '../../config';
import { IDashboardProps } from '../../types';

const DashboardDisplay: React.FC<IDashboardProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard {...props} />
    </ThemeProvider>
  );
};

export default DashboardDisplay;
