import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { ListForm } from '../../components';
import { theme } from '../../config';
import { IListFormProps } from '../../types';

const ListFormDisplay: React.FC<IListFormProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <ListForm {...props} />
    </ThemeProvider>
  );
};

export default ListFormDisplay;
