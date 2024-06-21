import { createTheme, colors } from '@mui/material';

const spTheme = (window as any).__themeState__.theme;

const theme = createTheme({
  palette: {
    background: {
      default: spTheme.bodyBackground,
    },
    common: {
      white: spTheme.white,
      black: spTheme.black,
    },
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
    success: {
      light: spTheme.greenLight,
      main: spTheme.green,
      dark: spTheme.greenDark,
    },
    info: {
      light: spTheme.yellowLight,
      main: spTheme.yellow,
      dark: spTheme.yellowDark,
    },
    warning: {
      light: spTheme.orangeLighter,
      main: spTheme.orangeLight,
      dark: spTheme.orange,
    },
    error: {
      main: spTheme.red,
      dark: spTheme.redDark,
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
