import { ThemeProvider } from '@mui/material';
import React from 'react';
import { ISearchBarProps, SearchBar } from '../../components/SearchBar';
import { theme } from '../../config/theme.config';

const SearchBarDisplay: React.FC<ISearchBarProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <SearchBar {...props} />
    </ThemeProvider>
  );
};

export default SearchBarDisplay;
