import { ThemeProvider } from '@mui/material';
import React from 'react';
import { theme } from '../../config';
import { ISearchBarProps, SearchBar } from '../../components';

const SearchBarDisplay: React.FC<ISearchBarProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <SearchBar {...props} />
    </ThemeProvider>
  );
};

export default SearchBarDisplay;
