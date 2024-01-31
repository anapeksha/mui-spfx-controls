import * as React from "react";

import {
  Autocomplete,
  Avatar,
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

export const PeoplePicker: FC<IPeoplePickerProps> = ({
  context,
  label,
  searchSuggestionLimit,
  multiple,
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      searchService
        .resolveUser(context, query, searchSuggestionLimit)
        .then((response) => {
          // const filteredResponse = handleDuplicates(response, selectedUsers);
          // console.log("filtered", filteredResponse);
          console.log(response);
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
      value={selectedUsers}
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
        console.log(value, reason);
        if (reason === "selectOption" || reason === "removeOption") {
          setSelectedUsers(value);
        } else if (reason === "clear") {
          setSelectedUsers([]);
        }
      }}
      onInputChange={(event, newValue) => setQuery(newValue)}
      renderOption={(props, option) => (
        <ListItem {...props}>
          <Stack direction="row" spacing={1}>
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
          color={color}
          variant={variant}
          error={error !== null ? true : false}
          helperText={error ? "Something went wrong" : ""}
          label={label}
        />
      )}
    />
  );
};
