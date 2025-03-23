jest.mock('../../src/services/ListService', () =>
  jest.requireActual('../mocks/ListService')
);

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IListFormProps } from '../../src/components/ListForm/IListFormProps';
import ListForm from '../../src/components/ListForm/ListForm';
import { mockedContext } from '../mocks/context';

describe('<ListForm />', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const mockListFields = ['Title', 'Status', 'AssignedTo', 'Created'];

  const props: IListFormProps = {
    context: mockedContext,
    list: 'MockList',
    fields: mockListFields,
    inputVariant: 'outlined',
    inputSize: 'small',
    fieldSpacing: 2,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  };

  /** Should render the list form component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<ListForm {...props} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('mui-spfx-list-form')).toBeInTheDocument();
    });
  });

  /** Render column headers properly */
  it('Should render column headers', async () => {
    await act(async () => {
      render(<ListForm {...props} />);
    });

    await act(async () => {
      expect(screen.getByText(mockListFields[0])).toBeInTheDocument();
      expect(screen.getByText(mockListFields[0])).toBeInTheDocument();
      expect(screen.getByText(mockListFields[0])).toBeInTheDocument();
      expect(screen.getByText(mockListFields[0])).toBeInTheDocument();
    });
  });

  /** Render input fields correctly based on field types */
  it('renders the correct input fields based on field types', async () => {
    await act(async () => {
      render(<ListForm {...props} />);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /title/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: /status/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: /assignedto/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /created/i })).toBeDisabled(); // ReadOnlyField
    });
  });

  it('handles text input changes', async () => {
    await act(async () => {
      render(<ListForm {...props} />);
    });

    const titleInput = await screen.findByRole('textbox', { name: /title/i });

    await act(async () => {
      await userEvent.type(titleInput, 'Test Project');
    });
    expect(titleInput).toHaveValue('Test Project');
  });

  it('handles choice field selection', async () => {
    await act(async () => {
      render(<ListForm {...props} />);
    });

    const statusSelect = await screen.findByRole('combobox', {
      name: /status/i,
    });

    await act(async () => {
      await userEvent.selectOptions(statusSelect, 'Completed');
    });
    expect(statusSelect).toHaveValue('Completed');
  });

  it('calls onSave with correct form data', async () => {
    await act(async () => {
      render(<ListForm {...props} />);
    });

    const titleInput = await screen.findByRole('textbox', { name: /title/i });
    await act(async () => {
      await userEvent.type(titleInput, 'New Task');
    });

    const saveButton = screen.getByRole('button', { name: /save/i });
    await act(async () => {
      await userEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({ Title: 'New Task' })
      );
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    await act(async () => {
      render(<ListForm {...props} />);
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await act(async () => {
      await userEvent.click(cancelButton);
    });

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
