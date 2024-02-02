import * as React from "react";

import {
  Autocomplete,
  Avatar,
  Chip,
  ListItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { FC, useEffect, useState } from "react";

import { IExtendedPeoplePickerEntity, IPeoplePickerProps } from "../types";

import { AccountCircle } from "@mui/icons-material";
import { PeopleSearchService } from "../services/PeopleSearchService";
import { handleDuplicates } from "../utils";

export const PeoplePicker: FC<IPeoplePickerProps> = ({
  context,
  label,
  onSelectionChange,
  searchSuggestionLimit,
  disabled,
  variant,
  color,
  size,
  LoadingComponent,
  styles,
  sx,
}) => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    IExtendedPeoplePickerEntity[]
  >([]);
  const [selectedUsers, setSelectedUsers] = useState<
    IExtendedPeoplePickerEntity[]
  >([]);
  const [searchService] = useState(new PeopleSearchService(context));
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      searchService
        .resolveUser(context, query, searchSuggestionLimit)
        .then((response) => {
          setSearchResults(response);
          setLoading(false);
        })
        .catch((error) => setError(error));
    } else if (query.length === 0) {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <Autocomplete
      multiple={true}
      options={searchResults}
      getOptionLabel={(option) => option.DisplayText}
      filterOptions={(options) => handleDuplicates(options, selectedUsers)}
      size={size}
      loading={loading}
      disabled={disabled}
      style={styles}
      sx={sx}
      loadingText={
        LoadingComponent || (
          <Stack direction="row" spacing={1}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton width="100%" height={40} />
          </Stack>
        )
      }
      onChange={(event, value, reason) => {
        if (reason === "selectOption" || reason === "removeOption") {
          setSelectedUsers(value);
          setQuery("");
          if (onSelectionChange) {
            onSelectionChange(value);
          }
        } else if (reason === "clear") {
          setSelectedUsers([]);
          setQuery("");
          if (onSelectionChange) {
            onSelectionChange([]);
          }
        }
      }}
      onInputChange={(event, newValue) => setQuery(newValue)}
      renderTags={(users, getTagProps) => {
        return users.map((user, index) => (
          <Chip
            {...getTagProps({ index })}
            avatar={<Avatar src={user.Image} />}
            label={user.DisplayText}
          />
        ));
      }}
      renderOption={(props, option) => (
        <ListItem {...props}>
          <Stack direction="row" spacing={1} alignItems="center">
            {option.Image !== "" ? (
              <Avatar sx={{ width: 40, height: 40 }} src={option.Image} />
            ) : (
              <Avatar sx={{ width: 40, height: 40 }}>
                <AccountCircle />
              </Avatar>
            )}
            <Typography variant="body1">{option.DisplayText}</Typography>
          </Stack>
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={variant}
          color={color}
          error={error !== null ? true : false}
          helperText={error ? "Something went wrong" : ""}
          label={label}
        />
      )}
    />
  );
};
