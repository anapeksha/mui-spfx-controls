jest.mock('../src/services/PeopleService', () =>
  jest.requireActual('./mocks/PeopleService')
);

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  IPeoplePickerProps,
  PeoplePicker,
} from '../src/components/PeoplePicker';
import { mockedContext } from './mocks/context';
import { mockUsers } from './mocks/PeopleService';

describe('<PeoplePicker />', () => {
  let props: IPeoplePickerProps = {
    context: mockedContext,
    label: 'Select User',
  };
  const userQuery: string = 'John';

  const onChangeMock = jest.fn();

  /** Should render component properly */
  it('Should render PeoplePicker component', async () => {
    await act(async () => {
      render(<PeoplePicker {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-peoplepicker')).toBeInTheDocument();
  });

  /** Show search results while typing */
  it('Should show search results while typing', async () => {
    await act(async () => {
      render(<PeoplePicker {...props} />);
    });

    const input = await screen.findByRole<HTMLInputElement>('combobox');

    await act(async () => {
      await userEvent.type(input, userQuery);
    });

    const user = await screen.findByText(mockUsers[0].DisplayText);

    await waitFor(() => {
      expect(user).toBeInTheDocument();
    });
  });

  /** Should call on change on single select */
  it('Should select a user from the search results', async () => {
    const updatedProps = { ...props, onChange: onChangeMock };

    await act(async () => {
      render(<PeoplePicker {...updatedProps} />);
    });

    const input = await screen.findByRole<HTMLInputElement>('combobox');

    await act(async () => {
      await userEvent.type(input, userQuery);
    });

    const user = await screen.findByText(mockUsers[0].DisplayText);

    await act(async () => {
      userEvent.click(user);
    });

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith(mockUsers[0]);
    });
  });
});
