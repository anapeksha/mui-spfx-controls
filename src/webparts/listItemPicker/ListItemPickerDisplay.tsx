import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import {
  IListItemPickerProps,
  ListItemPicker,
} from '../../components/ListItemPicker';
import { theme } from '../../config/theme.config';

const ListItemPickerDisplay: React.FC<IListItemPickerProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItemPicker {...props} />
    </ThemeProvider>
  );
};

export default ListItemPickerDisplay;
