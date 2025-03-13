jest.mock('../services/ListService');
jest.mock('../services/PeopleSearchService');

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Dashboard, IDashboardProps } from '../components/Dashboard';
import { mockContext } from './__mocks__/context'; // Ensure the path is correct

describe('<Dashboard />', () => {
  const fields = ['Title', 'Created', 'AssignedTo'];

  const mockProps: IDashboardProps = {
    context: mockContext,
    list: 'mockList',
    fields,
    columnAction: true,
    densityAction: true,
    filterAction: true,
    exportAction: true,
    searchAction: true,
    tabAction: false,
    tabValue: undefined as never,
    height: 500,
  };

  it('should render the Dashboard correctly', async () => {
    act(() => {
      render(<Dashboard {...mockProps} />);
    });

    await waitFor(() =>
      expect(screen.getByTestId('mui-spfx-dashboard')).toBeInTheDocument()
    );
  });

  it('should display correct number of rows', async () => {
    act(() => {
      render(<Dashboard {...mockProps} />);
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 3 data rows + 1 header row
    });
  });

  it('should filter rows based on search query', async () => {
    await act(async () => {
      render(<Dashboard {...mockProps} />);
    });

    const searchInput = screen.getByRole('textbox', { name: /search/i });

    await act(async () => {
      userEvent.type(searchInput, 'Project B');
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // 1 result row + 1 header row
      expect(screen.getByText('Project B')).toBeInTheDocument();
    });
  });

  it('should change rows when tab is switched', async () => {
    await act(async () => {
      render(<Dashboard {...mockProps} />);
    });

    const tabButton = screen.getByRole('tab', { name: /completed/i });

    await act(async () => {
      await userEvent.click(tabButton);
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2);
      expect(screen.getByText('Project B')).toBeInTheDocument();
    });
  });
});
