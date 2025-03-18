jest.mock('../../src/services/ListService', () =>
  jest.requireActual('../mocks/ListService')
);
jest.mock('../../src/services/PeopleService', () =>
  jest.requireActual('../mocks/PeopleService')
);

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Dashboard, IDashboardProps } from '../../src/components/Dashboard';
import { ITabSchema } from '../../src/components/Dashboard/IDashboardProps';
import { mockedContext } from '../mocks/context'; // Ensure this path is correct
import { mockedListItems } from '../mocks/ListService';

describe('<Dashboard />', () => {
  const searchText: string = 'Project Alpha';
  const mockedTabValue: ITabSchema[] = [
    {
      label: 'Active Projects',
      fieldToMatch: 'Status',
      stringToMatch: 'Active',
      displayFields: ['Title', 'AssignedTo', 'Created'],
      disabled: false,
      wrapped: false,
    },
    {
      label: 'Completed Projects',
      fieldToMatch: 'Status',
      stringToMatch: 'Completed',
      displayFields: ['Title', 'Priority', 'Created', 'Status'],
      disabled: false,
      wrapped: false,
    },
    {
      label: 'High Priority',
      fieldToMatch: 'Priority',
      stringToMatch: '1',
      displayFields: ['Title', 'AssignedTo', 'Priority'],
      disabled: false,
      wrapped: false,
    },
  ];
  const mockedInternalNames: string[] = [
    'Title',
    'Created',
    'AssignedTo',
    'Status',
    'Priority',
  ];
  const mockListName = 'MOCK_LIST';
  let props: IDashboardProps = {
    context: mockedContext,
    list: mockListName,
    fields: mockedInternalNames,
  };

  /** Should render the dashboard component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<Dashboard {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-dashboard')).toBeInTheDocument();
  });

  /** Match number of rows to be equal to dataset */
  it('Should display correct number of rows', async () => {
    await act(async () => {
      render(<Dashboard {...props} />);
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const bodyRowLength = rows.length - 1;
      expect(bodyRowLength).toBe(mockedListItems.length);
    });
  });

  /** Check search filter */
  it('Should filter rows based on search', async () => {
    props = { ...props, searchAction: true };

    await act(async () => {
      render(<Dashboard {...props} />);
    });

    const searchInput = await screen.getByPlaceholderText('Search');
    const searchForm = await screen.findByRole<HTMLFormElement>('search');

    await act(async () => {
      await userEvent.type(searchInput, searchText);
      searchForm.submit();
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const bodyRowLength = rows.length - 1;
      expect(bodyRowLength).toBe(
        mockedListItems.filter((value) => value.Title.includes(searchText))
          .length
      );
      expect(screen.getByText(searchText)).toBeInTheDocument();
    });
  });

  /** Tab change property check */
  it('Should change rows when tab switched', async () => {
    props = {
      ...props,
      searchAction: false,
      tabAction: true,
      tabValue: mockedTabValue,
    };

    await act(async () => {
      render(<Dashboard {...props} />);
    });

    const tabButton = screen.getByRole('tab', {
      name: mockedTabValue[1].label,
    });

    await act(async () => {
      userEvent.click(tabButton);
    });

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      const bodyRowLength2 = rows.length - 1;
      expect(bodyRowLength2).toBe(
        mockedListItems.filter((value) =>
          value[mockedTabValue[1].fieldToMatch].includes(
            mockedTabValue[1].stringToMatch
          )
        ).length
      );
    });
  });
});
