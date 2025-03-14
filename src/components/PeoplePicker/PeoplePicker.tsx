import { AccountCircle } from '@mui/icons-material';
import {
  Autocomplete,
  Avatar,
  Chip,
  CircularProgress,
  ListItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Logger } from '@pnp/logging';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { PeopleSearchService } from '../../services/PeopleSearchService';
import { handleDuplicates } from '../../utils/handleDuplicates';
import type {
  IPeoplePickerEntity,
  IPeoplePickerProps,
} from './IPeoplePickerProps';

export const PeoplePicker: FC<IPeoplePickerProps> = ({
  context,
  label,
  required,
  onChange,
  searchSuggestionLimit,
  renderInput,
  variant,
  tagVariant,
  color,
  tagColor,
  LoadingComponent,
  name,
  fullWidth,
  ...props
}) => {
  const searchService = new PeopleSearchService(context);
  const [query, setQuery] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<
    IPeoplePickerEntity[] | IPeoplePickerEntity | null
  >([]);
  const [searchResults, setSearchResults] = useState<IPeoplePickerEntity[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query !== '') {
      setLoading(true);
      searchService
        .searchUser(context, query, searchSuggestionLimit)
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
      {...props}
      data-testid="mui-spfx-peoplepicker"
      options={searchResults}
      getOptionLabel={(option: IPeoplePickerEntity) => option.DisplayText || ''}
      filterOptions={(options) =>
        handleDuplicates(
          options as IPeoplePickerEntity[],
          selectedUsers as IPeoplePickerEntity[]
        )
      }
      popupIcon={props.loading ? <CircularProgress size={20} /> : null}
      loading={loading}
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
        value: IPeoplePickerEntity | IPeoplePickerEntity[],
        reason
      ) => {
        if (reason === 'selectOption' || reason === 'removeOption') {
          setSelectedUsers(value);
          setQuery('');
          if (onChange) {
            onChange(value as any);
          }
        } else if (reason === 'clear') {
          setSelectedUsers([]);
          setQuery('');
          if (onChange) {
            onChange([] as any);
          }
        }
      }}
      onInputChange={(event, newValue) => setQuery(newValue)}
      renderTags={(users, getTagProps) => {
        return users.map((user: IPeoplePickerEntity, index) => (
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
      renderOption={(props, option: IPeoplePickerEntity) => (
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
      renderInput={
        renderInput
          ? renderInput
          : (params) => (
              <TextField
                {...params}
                name={name}
                variant={variant}
                required={required}
                color={color}
                error={error !== null ? true : false}
                helperText={error ? 'Something went wrong' : ''}
                label={label}
              />
            )
      }
    />
  );
};

export default PeoplePicker;
