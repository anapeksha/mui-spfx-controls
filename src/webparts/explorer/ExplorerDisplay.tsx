import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Explorer, IExplorerProps } from '../../components/Explorer';
import { theme } from '../../config/theme.config';

const ExplorerDisplay: React.FC<IExplorerProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Explorer {...props} />
    </ThemeProvider>
  );
};

export default ExplorerDisplay;
