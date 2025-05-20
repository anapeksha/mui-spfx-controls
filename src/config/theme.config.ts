import { colors, createTheme } from '@mui/material';

/**
 * Retrieves the current SharePoint theme from the global theme state.
 */
const spTheme = (window as any).__themeState__.theme;

/**
 * Creates a custom MUI theme based on SharePoint's theme settings.
 */
const theme = createTheme({
  palette: {
    background: {
      /** Default background color from SharePoint theme */
      default: spTheme.bodyBackground,
    },
    common: {
      /** Common white and black colors from SharePoint theme */
      white: spTheme.white,
      black: spTheme.black,
    },
    primary: {
      /** Primary color variations from SharePoint theme */
      light: spTheme.themeLight,
      main: spTheme.themePrimary,
      dark: spTheme.themeDark,
    },
    secondary: {
      /** Secondary color variations from SharePoint theme */
      light: spTheme.themeLighterAlt,
      main: spTheme.themeSecondary,
      dark: spTheme.themeDarkAlt,
    },
    success: {
      /** Success color variations from SharePoint theme */
      light: spTheme.greenLight,
      main: spTheme.green,
      dark: spTheme.greenDark,
    },
    info: {
      /** Info color variations from SharePoint theme */
      light: spTheme.yellowLight,
      main: spTheme.yellow,
      dark: spTheme.yellowDark,
    },
    warning: {
      /** Warning color variations from SharePoint theme */
      light: spTheme.orangeLighter,
      main: spTheme.orangeLight,
      dark: spTheme.orange,
    },
    error: {
      /** Error color variations from SharePoint theme */
      main: spTheme.red,
      dark: spTheme.redDark,
    },
  },
  transitions: {
    duration: {
      /** Transition duration settings */
      enteringScreen: 250,
      leavingScreen: 250,
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          /** Asterisk color override for required fields */
          color: colors.red[700],
        },
      },
    },
  },
});

export { theme };
