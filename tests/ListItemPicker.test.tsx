jest.mock('../src/services/ListService', () =>
  jest.requireActual('./mocks/ListService')
);

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IListItemPickerProps } from '../src/components/ListItemPicker/IListItemPickerProps';
import ListItemPicker from '../src/components/ListItemPicker/ListItemPicker';
import { mockedContext } from './mocks/context';

describe('<ListItemPicker />', () => {
  let props: IListItemPickerProps;
  const mockOnChange = jest.fn();

  beforeEach(() => {
    props = {
      context: mockedContext,
      list: 'MockList',
      fields: ['Title'],
      displayField: 'Title',
      label: 'Select Item',
      onSelectionChange: mockOnChange,
      multiple: false,
      searchSuggestionLimit: 10,
    };
  });

  it('renders the ListItemPicker correctly', async () => {
    await act(async () => {
      render(<ListItemPicker {...props} />);
    });

    expect(screen.getByLabelText(/select item/i)).toBeInTheDocument();
  });

  it('filters list items based on search query', async () => {
    await act(async () => {
      render(<ListItemPicker {...props} />);
    });

    const input = screen.getByRole('textbox', { name: /select item/i });

    await act(async () => {
      await userEvent.type(input, 'Project A');
    });

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
    });
  });

  it('calls onSelectionChange when an item is selected', async () => {
    await act(async () => {
      render(<ListItemPicker {...props} />);
    });

    const input = screen.getByRole('textbox', { name: /select item/i });

    await act(async () => {
      await userEvent.type(input, 'Project A');
      await userEvent.click(screen.getByText('Project A'));
    });

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });
});
