import { ThemeProvider } from '@mui/material';
import React from 'react';
import { CodeEditor, ICodeEditorProps } from '../../components/CodeEditor';
import { theme } from '../../config/theme.config';

const CodeEditorDisplay: React.FC<ICodeEditorProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <CodeEditor {...props} />
    </ThemeProvider>
  );
};

export default CodeEditorDisplay;
