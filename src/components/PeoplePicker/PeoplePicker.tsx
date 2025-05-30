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
import {
  ForwardRefExoticComponent,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { PeopleService } from '../../services/PeopleService';
import { handleDuplicates } from '../../utils/handleDuplicates';
import type {
  IPeoplePickerEntity,
  IPeoplePickerProps,
} from './IPeoplePickerProps';

export const PeoplePicker: ForwardRefExoticComponent<IPeoplePickerProps> =
  forwardRef(
    (
      {
        context,
        label,
        required,
        searchSuggestionLimit,
        variant,
        tagVariant,
        color,
        tagColor,
        principalSource,
        principalType,
        LoadingComponent,
        name,
        fullWidth,
        onChange,
        renderInput,
        ...props
      },
      ref: React.RefObject<HTMLDivElement>
    ) => {
      const peopleService = new PeopleService(context);
      const [query, setQuery] = useState<string>('');
      const [selectedUsers, setSelectedUsers] = useState<
        IPeoplePickerEntity[] | IPeoplePickerEntity | null
      >([]);
      const [searchResults, setSearchResults] = useState<IPeoplePickerEntity[]>(
        []
      );
      const [error, setError] = useState<Error | null>(null);
      const [loading, setLoading] = useState<boolean>(false);

      useEffect(() => {
        const searchUser = async (): Promise<void> => {
          if (query !== '') {
            try {
              setLoading(true);
              const searchedUsers = await peopleService.searchUser(
                context,
                query,
                searchSuggestionLimit,
                principalSource,
                principalType
              );
              setSearchResults(searchedUsers);
            } catch (error) {
              Logger.error(error);
              setError(error);
            } finally {
              setLoading(false);
            }
          } else {
            setSearchResults([]);
          }
        };

        searchUser();
      }, [query]);

      return (
        <Autocomplete
          {...props}
          ref={ref}
          data-testid="mui-spfx-peoplepicker"
          fullWidth={fullWidth ?? true}
          options={searchResults}
          getOptionLabel={(option: IPeoplePickerEntity) =>
            option?.DisplayText || ''
          }
          filterOptions={(options) =>
            handleDuplicates(
              options as IPeoplePickerEntity[],
              selectedUsers as IPeoplePickerEntity[]
            )
          }
          popupIcon={null}
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
                key={user.Key}
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
            renderInput ||
            ((params) => (
              <TextField
                {...params}
                name={name}
                variant={variant}
                required={required}
                color={color}
                error={error !== null}
                helperText={error ? 'Something went wrong' : ''}
                label={label}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {props.loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  },
                }}
              />
            ))
          }
        />
      );
    }
  );

export default PeoplePicker;
