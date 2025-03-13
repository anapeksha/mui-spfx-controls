import { colors, createTheme } from '@mui/material';

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
      dark: spTheme.themeDarkAlt,
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
  transitions: {
    duration: {
      enteringScreen: 250,
      leavingScreen: 250,
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
