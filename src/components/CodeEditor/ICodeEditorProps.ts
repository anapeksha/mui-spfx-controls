import { EditorProps } from '@monaco-editor/react';
import { BoxProps } from '@mui/material';

interface ICodeEditorProps extends Omit<EditorProps, 'height'> {
  height?: BoxProps['height'];
  renderControls?: boolean;
}

export type { ICodeEditorProps };
