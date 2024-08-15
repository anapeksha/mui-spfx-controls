import * as React from 'react';
import {
  Autocomplete,
  Avatar,
  Chip,
  ListItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { FC, useEffect, useState } from 'react';
import { Logger } from '@pnp/logging';
import type { IPeoplePickerProps } from './IPeoplePickerProps';
import type { IExtendedPeoplePickerEntity } from './IExtendedPeoplePicker';
import { PeopleSearchService } from '../../services';
import { handleDuplicates } from '../../utils';

export const PeoplePicker: FC<IPeoplePickerProps> = ({
  context,
  label,
  required,
  multiple,
  defaultValue,
  onSelectionChange,
  searchSuggestionLimit,
  disabled,
  variant,
  tagVariant,
  color,
  tagColor,
  size,
  LoadingComponent,
  styles,
  name,
  fullWidth,
  sx,
}) => {
  const searchService = new PeopleSearchService(context);
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<
    IExtendedPeoplePickerEntity[]
  >([]);
  const [selectedUsers, setSelectedUsers] = useState<
    IExtendedPeoplePickerEntity[] | IExtendedPeoplePickerEntity | null
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query !== '') {
      setLoading(true);
      searchService
        .resolveUser(context, query, searchSuggestionLimit)
        .then((response) => {
          setSearchResults(response);
          setLoading(false);
        })
        .catch((error) => {
          Logger.error(error);
          setError(error);
        });
    } else {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <Autocomplete
      multiple={multiple}
      options={searchResults}
      defaultValue={defaultValue}
      getOptionLabel={(option: IExtendedPeoplePickerEntity) =>
        option.DisplayText
      }
      filterOptions={(options) =>
        handleDuplicates(
          options as IExtendedPeoplePickerEntity[],
          selectedUsers as IExtendedPeoplePickerEntity[]
        )
      }
      popupIcon={null}
      size={size}
      loading={loading}
      disabled={disabled}
      style={styles}
      sx={sx}
      fullWidth
      loadingText={
        LoadingComponent || (
          <Stack direction="row" spacing={1}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton width="100%" height={40} />
          </Stack>
        )
      }
      onChange={(
        event,
        value: IExtendedPeoplePickerEntity | IExtendedPeoplePickerEntity[],
        reason
      ) => {
        if (reason === 'selectOption' || reason === 'removeOption') {
          setSelectedUsers(value);
          setQuery('');
          if (onSelectionChange) {
            onSelectionChange(value as any);
          }
        } else if (reason === 'clear') {
          setSelectedUsers([]);
          setQuery('');
          if (onSelectionChange) {
            onSelectionChange([] as any);
          }
        }
      }}
      onInputChange={(event, newValue) => setQuery(newValue)}
      renderTags={(users, getTagProps) => {
        return users.map((user: IExtendedPeoplePickerEntity, index) => (
          <Chip
            {...getTagProps({ index })}
            key={index}
            color={tagColor}
            variant={tagVariant}
            avatar={<Avatar src={user.Image} />}
            label={user.DisplayText}
          />
        ));
      }}
      renderOption={(props, option: IExtendedPeoplePickerEntity) => (
        <ListItem {...props}>
          <Stack direction="row" spacing={1} alignItems="center">
            {option.Image !== '' ? (
              <Avatar sx={{ width: 40, height: 40 }} src={option.Image} />
            ) : (
              <Avatar sx={{ width: 40, height: 40 }}>
                <AccountCircle />
              </Avatar>
            )}
            <Typography variant="body2">{option.DisplayText}</Typography>
          </Stack>
        </ListItem>
      )}
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

export default PeoplePicker;
