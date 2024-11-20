import { Description, Folder } from '@mui/icons-material';
import {
  Autocomplete,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { ISearchResult } from '@pnp/sp/search';
import debounce from 'lodash/debounce';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { SearchService } from '../../services';
import { ISearchBarProps } from './ISearchBarProps';

const SearchBar: FC<ISearchBarProps> = ({
  label,
  fullWidth,
  required,
  context,
  onSearchResultSelect,
}) => {
  const [options, setOptions] = useState<ISearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const searchService = new SearchService(context);

  useEffect(() => {
    if (open) {
      setLoading(true);
      searchService
        .search(query, 5)
        .then((response) => {
          setOptions(response.PrimarySearchResults);
          setLoading(false);
          setOpen(true);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [open, query]);

  const handleInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setOptions([]);
      setQuery(inputValue);
    },
    300
  );

  return (
    <Autocomplete
      open={open}
      fullWidth={fullWidth}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.Title as string}
      options={options}
      loading={loading}
      onChange={(_, selectedResult, reason) =>
        onSearchResultSelect
          ? onSearchResultSelect(selectedResult, reason)
          : null
      }
      popupIcon={null}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label ? label : 'Search'}
          variant="outlined"
          required={required}
          error={error !== null}
          helperText={error !== null ? 'Error searching' : ''}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <ListItem {...props} key={option.UniqueId}>
          <ListItemIcon>
            {(option.IsDocument as any) === 'true' && <Description />}
            {(option.IsContainer as any) === 'true' && <Folder />}
          </ListItemIcon>
          <ListItemText primary={option.Title} secondary={option.Author} />
        </ListItem>
      )}
      ListboxProps={{ sx: { maxHeight: 500 } }}
    />
  );
};

export default SearchBar;
