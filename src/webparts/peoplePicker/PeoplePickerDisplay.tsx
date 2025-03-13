import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import {
  PeoplePicker,
  type IPeoplePickerProps,
} from '../../components/PeoplePicker';
import { theme } from '../../config/theme.config';

const PeoplePickerDisplay: React.FC<IPeoplePickerProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <PeoplePicker {...props} />
    </ThemeProvider>
  );
};

export default PeoplePickerDisplay;
