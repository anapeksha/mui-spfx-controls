import { createTheme, colors } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: colors.red[700],
        },
      },
    },
  },
});

export { theme };
