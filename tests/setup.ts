import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

(globalThis as any).__themeState__ = {
  theme: {
    bodyBackground: '#ffffff',
    black: '#000000',
    white: '#FFFFFF',
    themePrimary: '#03787c',
    themeDark: '#025c5f',
    themeLight: '#98d6d8',
    themeLighterAlt: '#f0f9fa',
    themeDarkAlt: '#026d70',
    themeSecondary: '#13898d',
    greenLight: '#bad80a',
    green: '#107c10',
    greenDark: '#004b1c',
    yellowDark: '#d29200',
    yellow: '#ffb900',
    yellowLight: '#fff100',
    orange: '#d83b01',
    orangeLight: '#ea4300',
    orangeLighter: '#ff8c00',
    redDark: '#a4262c',
    red: '#e81123',
  },
};

configure({ testIdAttribute: 'data-testid' });
