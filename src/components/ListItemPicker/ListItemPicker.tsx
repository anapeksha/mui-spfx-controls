import { Autocomplete, Skeleton, TextField } from '@mui/material';
import { Logger } from '@pnp/logging';
import React, { FC, useEffect, useState } from 'react';
import { ListService } from '../../services/ListService';
import { IListItemPickerProps } from './IListItemPickerProps';

export const ListItemPicker: FC<IListItemPickerProps> = ({
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
}) => {
  const [listItems, setListItems] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const listService = new ListService(context, list);

  useEffect(() => {
    setLoading(true);
    listService
      .getListFields(fields)
      .then((response) => {
        listService
          .getListItems(response, '', 'Created', Number(searchSuggestionLimit))
          .then((itemResponse) => {
            setListItems(itemResponse);
            setLoading(false);
          })
          .catch((error) => {
            Logger.error(error);
          });
      })
      .catch((error) => {
        Logger.error(error);
        setError(error);
      });
  }, [list, fields, displayField, searchSuggestionLimit]);

  return (
    <Autocomplete
      multiple={multiple}
      disableCloseOnSelect={multiple}
      options={listItems}
      getOptionLabel={(option) => option[displayField] || ''}
      defaultValue={multiple ? [] : defaultValue}
      loading={loading}
      size={size}
      disabled={disabled}
      popupIcon={null}
      loadingText={LoadingComponent || <Skeleton width="100%" height={40} />}
      sx={sx}
      onChange={(event, value: any[]) => {
        console.log(value);
        if (onSelectionChange) {
          onSelectionChange(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          variant={variant}
          required={required}
          color={color}
          error={error !== null ? true : false}
          helperText={error ? 'Something went wrong' : ''}
          label={label}
          fullWidth={fullWidth || true}
        />
      )}
    />
  );
};

export default ListItemPicker;
