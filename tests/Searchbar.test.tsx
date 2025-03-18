jest.mock('../src/services/SearchService', () =>
  jest.requireActual('./mocks/SearchService')
);

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import SearchBar, { ISearchbarProps } from '../src/components/Searchbar';

describe('<SearchBar />', () => {
  let props: ISearchbarProps;
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    props = {
      context: {} as any,
      label: 'Search',
      onSearchResultSelect: mockOnSearch,
      scope: 'https://acme.sharepoint.com/sites/include',
    };
  });

  it('renders the SearchBar correctly', async () => {
    await act(async () => {
      render(<SearchBar {...props} />);
    });

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  });

  it('calls onSearchResultSelect when an input is provided', async () => {
    await act(async () => {
      render(<SearchBar {...props} />);
    });

    const input = screen.getByRole('textbox', { name: /search/i });

    await act(async () => {
      await userEvent.type(input, 'Test Query');
    });

    expect(mockOnSearch).toHaveBeenCalled();
  });
});
