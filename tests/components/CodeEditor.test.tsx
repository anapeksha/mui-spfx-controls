import { act, render, screen } from '@testing-library/react';
import { CodeEditor, ICodeEditorProps } from '../../src/components/CodeEditor';

describe('<CodeEditor />', () => {
  const props: ICodeEditorProps = {
    height: 500,
    renderControls: true,
  };

  /** Should render the code editor component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<CodeEditor {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-code-editor')).toBeInTheDocument();
  });
});
