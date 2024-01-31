import { ThemeProvider } from "@mui/material";
import * as React from "react";
import { PeoplePicker } from "../../components";
import { theme } from "../../config";
import { IPeoplePickerDisplayProps } from "./IPeoplePickerDisplayProps";

const PeoplePickerDisplay: React.FC<IPeoplePickerDisplayProps> = ({
  context,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <PeoplePicker
        label="People"
        context={context}
        searchSuggestionLimit={20}
      />
    </ThemeProvider>
  );
};

export default PeoplePickerDisplay;
