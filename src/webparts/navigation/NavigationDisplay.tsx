import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { theme } from '../../config';
import { Navigation } from '../../components';
import { INavigationProps } from '../../types';

const NavigationDisplay: React.FC<INavigationProps> = (props) => {
  console.log(props);
  return (
    <ThemeProvider theme={theme}>
      <Navigation {...props} />
    </ThemeProvider>
  );
};

export default NavigationDisplay;
