import * as React from 'react';
import { ThemeProvider } from '@mui/material';
import type { IListItemPickerProps } from '../../types';
import { theme } from '../../config';
import { ListItemPicker } from '../../components';

const ListItemPickerDisplay: React.FC<IListItemPickerProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItemPicker {...props} />
    </ThemeProvider>
  );
};

export default ListItemPickerDisplay;
