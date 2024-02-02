import { ThemeProvider } from "@mui/material";
import * as React from "react";
import { PeoplePicker } from "../../components";
import { theme } from "../../config";
import { IPeoplePickerProps } from "../../types";

const PeoplePickerDisplay: React.FC<IPeoplePickerProps> = ({
  context,
  label,
  size,
  searchSuggestionLimit,
  variant,
  disabled,
  color,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <PeoplePicker
        label={label}
        context={context}
        size={size}
        variant={variant}
        color={color}
        disabled={disabled}
        searchSuggestionLimit={searchSuggestionLimit}
      />
    </ThemeProvider>
  );
};

export default PeoplePickerDisplay;
