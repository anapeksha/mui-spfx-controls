import { OnChange } from '@monaco-editor/react';
import { BoxProps } from '@mui/material';

interface ICodeEditorProps {
  value?: string;
  height?: BoxProps['height'];
  renderControls?: boolean;
  onChange?: OnChange;
}

export type { ICodeEditorProps };
