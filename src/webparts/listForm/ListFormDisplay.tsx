import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { ListForm, type IListFormProps } from '../../components';
import { theme } from '../../config';

const ListFormDisplay: React.FC<IListFormProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <ListForm {...props} />
    </ThemeProvider>
  );
};

export default ListFormDisplay;
