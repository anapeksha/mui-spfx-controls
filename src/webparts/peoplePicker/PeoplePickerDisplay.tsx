import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { PeoplePicker } from '../../components';
import { theme } from '../../config';
import { IPeoplePickerProps } from '../../types';

const PeoplePickerDisplay: React.FC<IPeoplePickerProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <PeoplePicker
        {...props}
      />
    </ThemeProvider>
  );
};

export default PeoplePickerDisplay;
