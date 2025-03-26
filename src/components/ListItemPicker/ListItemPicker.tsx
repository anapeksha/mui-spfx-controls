import { Autocomplete, Skeleton, TextField } from '@mui/material';
import { Logger } from '@pnp/logging';
import debounce from 'lodash/debounce';
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { ListService } from '../../services/ListService';
import { IListItemPickerProps } from './IListItemPickerProps';

export const ListItemPicker: ForwardRefExoticComponent<IListItemPickerProps> =
  forwardRef(
    (
      {
        context,
        label,
        list,
        fields,
        displayField,
        required,
        multiple,
        defaultValue,
        onSelectionChange,
        searchSuggestionLimit,
        disabled,
        variant,
        color,
        size,
        LoadingComponent,
        name,
        fullWidth,
        sx,
      },
      ref: RefObject<HTMLDivElement>
    ) => {
      const [listItems, setListItems] = useState<any[]>([]);
      const [query, setQuery] = useState('');
      const [error, setError] = useState<Error | null>(null);
      const [loading, setLoading] = useState(false);
      const listService = new ListService(context, list);

      useEffect(() => {
        const fetchItems = debounce(async (): Promise<void> => {
          try {
            setLoading(true);
            const fieldResponse = await listService.getListFields(fields);
            const itemResponse = await listService.getListItems(
              fieldResponse,
              `substringof('${query}', ${displayField})`,
              'Created',
              Number(searchSuggestionLimit)
            );
            setListItems(itemResponse);
          } catch (error) {
            Logger.error(error);
            setError(error);
          } finally {
            setLoading(false);
          }
        }, 300);

        fetchItems();
      }, [list, fields, displayField, searchSuggestionLimit, query]);

      return (
        <Autocomplete
          ref={ref}
          multiple={multiple}
          disableCloseOnSelect={multiple}
          options={listItems}
          getOptionLabel={(option) => option[displayField] || ''}
          defaultValue={defaultValue}
          filterOptions={(x) => x}
          loading={loading}
          size={size}
          disabled={disabled}
          popupIcon={null}
          loadingText={
            LoadingComponent || <Skeleton width="100%" height={40} />
          }
          sx={sx}
          onChange={(event, value: any[]) => {
            if (onSelectionChange) {
              onSelectionChange(value);
            }
          }}
          onInputChange={(event, newValue) => setQuery(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              name={name}
              variant={variant}
              required={required}
              color={color}
              error={error !== null}
              helperText={error ? 'Something went wrong' : ''}
              label={label}
              fullWidth={fullWidth || true}
            />
          )}
        />
      );
    }
  );

export default ListItemPicker;
