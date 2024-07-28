import * as React from 'react';
import { ThemeProvider } from '@mui/material';
import type { IListItemPickerProps } from './components/IListItemPickerProps';
import { theme } from '../../config';

const ListItemPickerDisplay: React.FC<IListItemPickerProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <div>Hello</div>
    </ThemeProvider>
  );
};

export default ListItemPickerDisplay;
