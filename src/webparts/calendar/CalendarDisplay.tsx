import { ThemeProvider } from "@mui/material";
import * as React from "react";
import { Calendar } from "../../components";
import { theme } from "../../config";
import { ICalendarProps } from "../../types";

const CalendarDisplay: React.FC<ICalendarProps> = ({ context }) => {
  return (
    <ThemeProvider theme={theme}>
      <Calendar context={context} />
    </ThemeProvider>
  );
};

export default CalendarDisplay;
