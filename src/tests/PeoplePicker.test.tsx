jest.mock('../services/PeopleSearchService', () =>
  jest.requireActual('./mocks/PeopleSearchService')
);

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IPeoplePickerProps, PeoplePicker } from '../components/PeoplePicker';
import { mockedContext } from './mocks/context';
import { mockUserList } from './mocks/PeopleSearchService';

describe('<PeoplePicker />', () => {
  let props: IPeoplePickerProps = {
    context: mockedContext,
    label: 'Select User',
  };

  it('Should render PeoplePicker component', async () => {
    await act(async () => {
      render(<PeoplePicker {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-peoplepicker')).toBeInTheDocument();
  });

  it('Should show search results while typing', async () => {
    await act(async () => {
      render(<PeoplePicker {...props} />);
    });

    const input = await screen.findByRole<HTMLInputElement>('combobox');

    await act(async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'John', {
        delay: 1000,
      });
    });

    const user = await screen.findByText(mockUserList[0].DisplayText);

    await waitFor(() => {
      expect(user).toBeInTheDocument();
    });
  });

  //   it('should select a user from the search results', async () => {
  //     render(
  //       <PeoplePicker
  //         context={mockedContext}
  //         label="Select User"
  //         onChange={onChangeMock}
  //       />
  //     );

  //     const input = screen.getByLabelText('Select User');
  //     await userEvent.type(input, 'John');

  //     await waitFor(() => {
  //       userEvent.click(screen.getByText(mockUserList[0].DisplayText));
  //     });

  //     expect(screen.getByText(mockUserList[0].DisplayText)).toBeInTheDocument();
  //     expect(onChangeMock).toHaveBeenCalledWith([mockUserList[0]]);
  //   });

  //   it('should remove a selected user', async () => {
  //     render(
  //       <PeoplePicker
  //         context={mockedContext}
  //         label="Select User"
  //         onChange={onChangeMock}
  //       />
  //     );

  //     const input = screen.getByLabelText('Select User');
  //     await userEvent.type(input, 'John');

  //     await waitFor(() => {
  //       userEvent.click(screen.getByText(mockUserList[0].DisplayText));
  //     });

  //     const removeButton = screen.getByRole('button', { name: /close/i });
  //     await userEvent.click(removeButton);

  //     await waitFor(() => {
  //       expect(
  //         screen.queryByText(mockUserList[0].DisplayText)
  //       ).not.toBeInTheDocument();
  //     });

  //     expect(onChangeMock).toHaveBeenCalledWith([]);
  //   });

  //   it('should show a loading state while fetching results', async () => {
  //     render(
  //       <PeoplePicker
  //         context={mockedContext}
  //         label="Select User"
  //         onChange={onChangeMock}
  //       />
  //     );

  //     const input = screen.getByLabelText('Select User');
  //     await userEvent.type(input, 'John');

  //     expect(screen.getByRole('progressbar')).toBeInTheDocument();
  //   });
});
