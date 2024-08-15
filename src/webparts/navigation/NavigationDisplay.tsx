import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { Navigation, INavigationProps } from '../../components';
import { theme } from '../../config';

const NavigationDisplay: React.FC<INavigationProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Navigation {...props} />
    </ThemeProvider>
  );
};

export default NavigationDisplay;
