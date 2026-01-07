import { AccountCircle } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  ListItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Logger } from "@pnp/logging";
import * as React from "react";
import {
  ForwardRefExoticComponent,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { PeopleService } from "../../services/PeopleService";
import { handleDuplicates } from "../../utils/handleDuplicates";
import type {
  IPeoplePickerEntity,
  IPeoplePickerProps,
} from "./IPeoplePickerProps";

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
      ref: React.ForwardedRef<HTMLDivElement>,
    ) => {
      const peopleService = new PeopleService(context);
      const [query, setQuery] = useState<string>("");
      const [selectedUsers, setSelectedUsers] = useState<
        IPeoplePickerEntity[] | IPeoplePickerEntity | null
      >([]);
      const [searchResults, setSearchResults] = useState<IPeoplePickerEntity[]>(
        [],
      );
      const [error, setError] = useState<Error | null>(null);
      const [loading, setLoading] = useState<boolean>(false);

      const searchUser = async (): Promise<void> => {
        if (query !== "") {
          try {
            setLoading(true);
            const searchedUsers = await peopleService.searchUser(
              context,
              query,
              searchSuggestionLimit,
              principalSource,
              principalType,
            );
            setSearchResults(searchedUsers);
          } catch (error) {
            Logger.error(error as Error);
            setError(error as Error);
          } finally {
            setLoading(false);
          }
        } else {
          setSearchResults([]);
        }
      };

      useEffect(() => {
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
            option?.DisplayText || ""
          }
          filterOptions={(options) =>
            handleDuplicates(
              options as IPeoplePickerEntity[],
              selectedUsers as IPeoplePickerEntity[],
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
            value,
            reason,
          ) => {
            if (reason === "selectOption" || reason === "removeOption") {
              setSelectedUsers(value);
              setQuery("");
              if (onChange) {
                onChange(value as any);
              }
            } else if (reason === "clear") {
              setSelectedUsers([]);
              setQuery("");
              if (onChange) {
                onChange([] as any);
              }
            }
          }}
          onInputChange={(event, newValue) => setQuery(newValue)}
          renderValue={(users, getItemProps) => 
            Array.isArray(users) ?
            (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {users.map((user, index) => (
                <Chip
                  {...getItemProps({ index })}
                  key={user.Key}
                  color={tagColor}
                  variant={tagVariant}
                  avatar={<Avatar src={user.Image} />}
                  label={user.DisplayText}
                />
              ))}
              </Box>
            ) : (
                <Chip
                  key={users.Key}
                  color={tagColor}
                  variant={tagVariant}
                  avatar={<Avatar src={users.Image} />}
                  label={users.DisplayText}
                />
              )
          }
          renderOption={(props, option: IPeoplePickerEntity) => (
            <ListItem {...props}>
              <Stack direction="row" spacing={1} alignItems="center">
                {option.Image !== "" ? (
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
                helperText={error ? "Something went wrong" : ""}
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
    },
  );

export default PeoplePicker;
