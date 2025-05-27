jest.mock('../../src/services/ListService', () =>
  jest.requireActual('../mocks/ListService')
);

import { act, render, screen } from '@testing-library/react';
import {
  IListItemPickerProps,
  ListItemPicker,
} from '../../src/components/ListItemPicker';
import { mockedContext } from '../mocks/context';

describe('<ListItemPicker />', () => {
  const mockListName = 'MOCK_LIST';
  const mockedInternalNames: string[] = [
    'Title',
    'Created',
    'AssignedTo',
    'Status',
    'Priority',
  ];
  const mockLabel = 'Mock List Item Picker';
  const mockDisplayField = 'Title';
  const props: IListItemPickerProps = {
    context: mockedContext,
    list: mockListName,
    fields: mockedInternalNames,
    label: mockLabel,
    displayField: mockDisplayField,
  };

  /** Should render the explorer component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<ListItemPicker {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-list-item-picker')).toBeInTheDocument();
  });
});
