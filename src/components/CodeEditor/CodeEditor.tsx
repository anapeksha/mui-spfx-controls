import { Editor } from '@monaco-editor/react';
import {
  Box,
  FormControlLabel,
  MenuItem,
  Paper,
  Switch,
  TextField,
} from '@mui/material';
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  RefObject,
  useMemo,
  useState,
} from 'react';
import { ICodeEditorProps } from './ICodeEditorProps';

enum Languages {
  javascript = 'javascript',
  typescript = 'typescript',
  html = 'html',
  handlebars = 'handlebars',
  markdown = 'markdown',
  less = 'less',
  css = 'css',
  scss = 'scss',
  json = 'json',
  xml = 'xml',
}

enum Theme {
  vs = 'vs',
  vsDark = 'vs-dark',
  hcBlack = 'hc-black',
}

interface ILanguageArray {
  label: string;
  value: Languages;
}

interface IThemeArray {
  label: string;
  value: Theme;
}

const languages: Array<ILanguageArray> = [
  { label: 'Javascript', value: Languages.javascript },
  { label: 'Typescript', value: Languages.typescript },
  { label: 'HTML', value: Languages.html },
  { label: 'Handlebars', value: Languages.handlebars },
  { label: 'Markdown', value: Languages.markdown },
  { label: 'LESS', value: Languages.less },
  { label: 'CSS', value: Languages.css },
  { label: 'SCSS', value: Languages.scss },
  { label: 'JSON', value: Languages.json },
  { label: 'XML', value: Languages.xml },
];

const themes: Array<IThemeArray> = [
  { label: 'VS', value: Theme.vs },
  { label: 'VS Dark', value: Theme.vsDark },
  { label: 'High Contrast', value: Theme.hcBlack },
];

const CodeEditor: ForwardRefExoticComponent<ICodeEditorProps> = forwardRef(
  (
    { height, value, renderControls = true, onChange, ...props },
    ref: RefObject<HTMLDivElement>
  ) => {
    const [language, setLanguage] = useState<Languages>(Languages.javascript);
    const [theme, setTheme] = useState<Theme>(Theme.vs);
    const [fontSize, setFontSize] = useState(14);
    const [tabSize, setTabSize] = useState(4);
    const [wordWrap, setWordWrap] = useState<'off' | 'on'>('off');
    const [lineNumbers, setLineNumbers] = useState<'on' | 'off'>('on');
    const [minimap, setMinimap] = useState<{
      enabled: boolean;
      renderCharacters: true;
    }>({
      enabled: true,
      renderCharacters: true,
    });

    const options = useMemo(() => {
      return {
        theme,
        fontSize,
        wordWrap,
        lineNumbers,
        minimap,
        tabSize,
      };
    }, [theme, fontSize, wordWrap, lineNumbers, minimap, tabSize]);

    return (
      <Paper
        variant="outlined"
        sx={{
          height: height ?? { xs: 300, md: 400, xl: 500 },
          p: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'hidden',
        }}
        ref={ref}
      >
        {renderControls ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 150 }}>
              <TextField
                id="code-editor-language"
                value={language}
                label="Language"
                fullWidth
                select
                size="small"
                onChange={(event) => {
                  setLanguage(event.target.value as Languages);
                }}
              >
                {languages.map(({ label, value }, index) => (
                  <MenuItem key={`${value}-${index}`} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: 150 }}>
              <TextField
                id="code-editor-theme"
                value={theme}
                label="Theme"
                fullWidth
                select
                size="small"
                onChange={(event) => {
                  setTheme(event.target.value as Theme);
                }}
              >
                {themes.map(({ label, value }, index) => (
                  <MenuItem key={`${value}-${index}`} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: 150 }}>
              <TextField
                id="code-editor-font-size"
                value={fontSize}
                type="number"
                label="Font Size"
                fullWidth
                size="small"
                onChange={(event) => {
                  setFontSize(Number(event.target.value));
                }}
              />
            </Box>
            <Box sx={{ width: 150 }}>
              <TextField
                id="code-editor-tab-size"
                value={tabSize}
                type="number"
                label="Tab Size"
                fullWidth
                size="small"
                onChange={(event) => {
                  setTabSize(Number(event.target.value));
                }}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={wordWrap === 'on'}
                  onChange={(event) =>
                    setWordWrap(event.target.checked ? 'on' : 'off')
                  }
                />
              }
              label="Word Wrap"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={lineNumbers === 'on'}
                  onChange={(event) =>
                    setLineNumbers(event.target.checked ? 'on' : 'off')
                  }
                />
              }
              label="Line Numbers"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={minimap.enabled}
                  onChange={(event) =>
                    setMinimap({ ...minimap, enabled: event.target.checked })
                  }
                />
              }
              label="Minimap"
            />
          </Box>
        ) : null}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Editor {...props} language={language} options={options} />
        </Box>
      </Paper>
    );
  }
);

export default CodeEditor;

export { Languages };
