import { Description, Folder } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { Logger } from '@pnp/logging';
import { ISearchResult } from '@pnp/sp/search';
import debounce from 'lodash/debounce';
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  Fragment,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { SearchService } from '../../services/SearchService';
import { ISearchbarProps } from './ISearchbarProps';

const Searchbar: ForwardRefExoticComponent<ISearchbarProps> = forwardRef(
  (
    {
      label,
      variant,
      color,
      size,
      fullWidth,
      scope,
      excludedScope,
      context,
      onSearchResultSelect,
    },
    ref: RefObject<HTMLDivElement>
  ) => {
    const [options, setOptions] = useState<ISearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [error, setError] = useState<Error | null>(null);
    const searchService = new SearchService(context);

    const createQuery = useCallback(() => {
      if (scope && excludedScope) {
        return `FileName:${query} AND Path:${scope} AND -Path:${excludedScope}`;
      } else if (scope) {
        return `FileName:${query} AND Path:${scope}`;
      } else if (excludedScope) {
        return `FileName:${query} AND -Path:${excludedScope}`;
      } else {
        return `FileName:${query}`;
      }
    }, [query, scope, excludedScope]);

    useEffect(() => {
      if (!open || query === '') {
        return;
      }
      setLoading(true);
      const builtQuery = createQuery();
      searchService
        .search(builtQuery, 5)
        .then((response) => {
          setOptions(response.PrimarySearchResults);
          setLoading(false);
          setOpen(true);
        })
        .catch((error) => {
          Logger.error(error);
          setError(error);
          setLoading(false);
        });
    }, [open, query]);

    const handleInputChange = debounce(
      (
        _event: React.SyntheticEvent,
        value: string,
        reason: AutocompleteInputChangeReason
      ) => {
        setOptions([]);
        switch (reason) {
          case 'input':
            setQuery(value);
            break;
          case 'clear':
            setQuery('');
            break;
          case 'reset':
            setQuery('');
        }
      },
      300
    );

    return (
      <Autocomplete
        ref={ref}
        open={open}
        role="searchbox"
        fullWidth={fullWidth}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => option.Title as string}
        size={size}
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
            color={color}
            variant={variant}
            error={error !== null}
            helperText={error !== null ? 'Error searching' : ''}
            slotProps={{
              input: {
                ...params.InputProps,
                role: 'search',
                endAdornment: (
                  <Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              },
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
        slotProps={{
          listbox: {
            sx: { maxHeight: 500 },
          },
        }}
      />
    );
  }
);

export default Searchbar;
