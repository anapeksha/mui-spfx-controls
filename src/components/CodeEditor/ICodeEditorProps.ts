import { EditorProps } from '@monaco-editor/react';
import { BoxProps } from '@mui/material';

/**
 * Props for the CodeEditor component.
 */
interface ICodeEditorProps extends Omit<EditorProps, 'height'> {
  /**
   * The height of the editor. Can be any valid CSS height value.
   * Overrides the default height from Monaco Editor props.
   */
  height?: BoxProps['height'];

  /**
   * Whether to render additional controls (e.g., language and theme selectors).
   * @default false
   */
  renderControls?: boolean;
}

export type { ICodeEditorProps };
