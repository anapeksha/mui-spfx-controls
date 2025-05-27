jest.mock('../../src/services/SearchService', () =>
  jest.requireActual('../mocks/SearchService')
);

import { act, render, screen } from '@testing-library/react';
import { ISearchbarProps, Searchbar } from '../../src/components/Searchbar';
import { mockedContext } from '../mocks/context';

describe('<Searchbar />', () => {
  const props: ISearchbarProps = {
    context: mockedContext,
    onSearchResultSelect: jest.fn(),
  };

  /** Should render the explorer component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<Searchbar {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-searchbar')).toBeInTheDocument();
  });
});
