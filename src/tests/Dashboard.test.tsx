jest.mock('../services/ListService');
jest.mock('../services/PeopleSearchService');

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Dashboard, IDashboardProps } from '../components/Dashboard';
import { mockContext } from './__mocks__/context'; // Ensure this path is correct

describe('<Dashboard />', () => {
  let props: IDashboardProps;

  beforeEach(async () => {
    jest.clearAllMocks();

    props = {
      context: mockContext,
      list: 'mockList',
      fields: ['Title', 'Status'],
      columnAction: true,
      densityAction: true,
      filterAction: true,
      exportAction: true,
      searchAction: true,
      tabAction: false,
      tabValue: undefined as never,
    };

    await act(async () => {
      render(<Dashboard {...props} />);
    });
  });

  it('should render the Dashboard component', async () => {
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('should display correct number of rows', async () => {
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(3); // Adjust based on the actual data
    });
  });

  it('should filter rows based on search input', async () => {
    const searchInput = screen.getByRole('textbox', { name: /search/i });

    await act(async () => {
      await userEvent.type(searchInput, 'Project B');
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(2); // 1 result row + 1 header row
      expect(screen.getByText('Project B')).toBeInTheDocument();
    });
  });

  it('should change rows when tab is switched', async () => {
    const tabButton = screen.getByRole('button', { name: /completed/i });

    await act(async () => {
      userEvent.click(tabButton);
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(2);
      expect(screen.getByText('Project B')).toBeInTheDocument();
    });
  });
});
