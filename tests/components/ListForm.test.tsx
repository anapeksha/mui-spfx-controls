jest.mock('../../src/services/ListService', () =>
  jest.requireActual('../mocks/ListService')
);

import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { IListFormProps, ListForm } from '../../src/components/ListForm';
import { mockedContext } from '../mocks/context';

describe('<ListForm />', () => {
  const mockListName = 'MOCK_LIST';
  const mockedInternalNames: string[] = [
    'Title',
    'Created',
    'AssignedTo',
    'Status',
    'Priority',
  ];
  const props: IListFormProps = {
    context: mockedContext,
    list: mockListName,
    fields: mockedInternalNames,
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  /** Should render the explorer component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<ListForm {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-listform')).toBeInTheDocument();
  });
});
