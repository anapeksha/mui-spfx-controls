import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { PeoplePicker, type IPeoplePickerProps } from '../../components';
import { theme } from '../../config';

const PeoplePickerDisplay: React.FC<IPeoplePickerProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <PeoplePicker {...props} />
    </ThemeProvider>
  );
};

export default PeoplePickerDisplay;
