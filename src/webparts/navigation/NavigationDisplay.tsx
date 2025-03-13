import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { INavigationProps, Navigation } from '../../components/Navigation';
import { theme } from '../../config/theme.config';

const NavigationDisplay: React.FC<INavigationProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Navigation {...props} />
    </ThemeProvider>
  );
};

export default NavigationDisplay;
