import { createTheme, colors } from '@mui/material';

const spTheme = (window as any).__themeState__.theme;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: spTheme.themeLight,
      main: spTheme.themePrimary,
      dark: spTheme.themeDark,
    },
    secondary: {
      light: spTheme.themeLighterAlt,
      main: spTheme.themeSecondary,
      dark: spTheme.themeDarkerAlt,
    },
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
