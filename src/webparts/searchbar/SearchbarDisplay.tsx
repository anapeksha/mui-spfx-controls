import { ThemeProvider } from '@mui/material';
import React from 'react';
import { ISearchbarProps, Searchbar } from '../../components/Searchbar';
import { theme } from '../../config/theme.config';

const SearchBarDisplay: React.FC<ISearchbarProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Searchbar {...props} />
    </ThemeProvider>
  );
};

export default SearchBarDisplay;
