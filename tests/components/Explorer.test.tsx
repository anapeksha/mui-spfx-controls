jest.mock('../../src/services/LibraryService', () =>
  jest.requireActual('../mocks/LibraryService')
);

import { act, render, screen } from '@testing-library/react';
import { Explorer, IExplorerProps } from '../../src/components/Explorer';
import { mockedContext } from '../mocks/context';

describe('<Explorer />', () => {
  const mockedLibrary = {
    id: 'mocked-library',
  };
  const props: IExplorerProps = {
    context: mockedContext,
    library: mockedLibrary,
  };

  /** Should render the explorer component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<Explorer {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-explorer')).toBeInTheDocument();
  });
});
