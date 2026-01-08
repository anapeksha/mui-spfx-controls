import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { CodeEditor, ICodeEditorProps } from '../../src/components/CodeEditor';

describe('<CodeEditor />', () => {
  const props: ICodeEditorProps = {
    height: 500,
    renderControls: true,
  };

  beforeEach(async () => {
    await act(async () => {
      render(<CodeEditor {...props} />);
    });
  });

  afterEach(() => {
    cleanup();
  });

  /** Should render the code editor component properly */
  it('Should render the component', async () => {
    expect(screen.getByTestId('mui-spfx-code-editor')).toBeInTheDocument();
  });

  it('Should run the onChange functions', async () => {
    const languageSelector = screen.getByTestId(
      'code-editor-language'
    ) as HTMLSelectElement;
    const themeSelector = screen.getByTestId(
      'code-editor-theme'
    ) as HTMLSelectElement;
    const fontSizeInput = screen.getByTestId(
      'code-editor-font-size'
    ) as HTMLInputElement;
    const tabSizeInput = screen.getByTestId(
      'code-editor-tab-size'
    ) as HTMLInputElement;

    // Change events
    await act(async () => {
      languageSelector.value = 'javascript';
      themeSelector.value = 'vs-dark';
      fontSizeInput.value = '18';
      tabSizeInput.value = '4';

      fireEvent.change(languageSelector);
      fireEvent.change(themeSelector);
      fireEvent.change(fontSizeInput);
      fireEvent.change(tabSizeInput);
    });

    expect(languageSelector.value).toBe('javascript');
    expect(themeSelector.value).toBe('vs-dark');
    expect(fontSizeInput.value).toBe('18');
    expect(tabSizeInput.value).toBe('4');
  });
});
