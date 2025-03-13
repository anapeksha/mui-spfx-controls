jest.mock('../services/ListService');
jest.mock('../services/PeopleSearchService');

import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { ListService } from '../services/ListService';
import { PeopleSearchService } from '../services/PeopleSearchService';
import { mockContext } from './__mocks__/context';

describe('Dashboard Component', () => {
  let mockListService: jest.Mocked<ListService>;
  let mockPeopleSearchService: jest.Mocked<PeopleSearchService>;

  const mockList = 'TestList';
  const mockFields = ['Title', 'Created', 'AssignedTo'];

  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();

    mockListService = new ListService(
      mockContext,
      mockList
    ) as jest.Mocked<ListService>;

    mockPeopleSearchService = new PeopleSearchService(
      mockContext
    ) as jest.Mocked<PeopleSearchService>;
  });
  it('calls listService.getListFields with correct fields', async () => {
    render(
      <Dashboard
        context={mockContext}
        list={mockList}
        fields={mockFields}
        tabAction={false}
        tabValue={undefined as never}
        editable={false}
        resizable={false}
        columnAction={false}
        densityAction={false}
        filterAction={false}
        exportAction={false}
        searchAction={false}
        height={500}
        sx={{}}
      />
    );

    await waitFor(() => {
      expect(mockListService.getListFields).toHaveBeenCalledWith(mockFields);
      expect(mockPeopleSearchService.resolveUser).toHaveBeenCalledWith(
        mockContext,
        'admin@contoso.com'
      );
    });
  });

  it('calls listService.getListItems with correct parameters', async () => {
    render(
      <Dashboard
        context={mockContext}
        list={mockList}
        fields={mockFields}
        tabAction={false}
        tabValue={undefined as never}
        editable={false}
        resizable={false}
        columnAction={false}
        densityAction={false}
        filterAction={false}
        exportAction={false}
        searchAction={false}
        height={500}
        sx={{}}
      />
    );

    await waitFor(() => {
      expect(mockListService.getListItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ InternalName: 'Title' }),
          expect.objectContaining({ InternalName: 'Created' }),
        ]),
        '',
        'Created'
      );
      expect(mockPeopleSearchService.resolveUser).toHaveBeenCalledWith(
        mockContext,
        'admin@contoso.com'
      );
    });
  });
});
