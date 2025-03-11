jest.mock('../../services/ListService');

import { DataGrid } from '@mui/x-data-grid';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Dashboard } from '../components';
import { IDashboardProps } from '../components/Dashboard/IDashboardProps';
import { ListService } from '../services';
import { mockContext } from './__mocks__/context';

describe('Dashboard Component Tests', () => {
  let wrapper: any;
  let listService: ListService;
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

  beforeEach(async () => {
    listService = new ListService(mockContext, 'mockList');

    await act(async () => {
      wrapper = mount((<Dashboard {...mockProps} />) as any);
    });

    wrapper.update();
  });

  it('should render the DataGrid', () => {
    expect(wrapper.find(DataGrid).exists()).toBe(true);
  });

  it('should call getListFields and getListItems on mount', () => {
    expect(listService.getListFields).toHaveBeenCalledWith(fields);
    expect(listService.getListItems).toHaveBeenCalled();
  });

  it('should display correct number of rows', () => {
    const rows = wrapper.find(DataGrid).prop('rows');
    expect(rows).toHaveLength(3); // Assuming the mock returns 3 items
  });

  it('should filter rows based on search query', async () => {
    await act(async () => {
      wrapper.find('input[aria-label="search"]').simulate('change', {
        target: { value: 'Project B' },
      });
      wrapper.find('form').simulate('submit');
    });

    wrapper.update();

    const filteredRows = wrapper.find(DataGrid).prop('rows');
    expect(filteredRows).toHaveLength(1);
    expect(filteredRows[0].Title).toBe('Project B');
  });

  it('should change rows when tab is switched', async () => {
    const newTab = { fieldToMatch: 'Status', stringToMatch: 'Completed' };

    await act(async () => {
      wrapper.find('Tabs').prop('onChange')(null, newTab);
    });

    wrapper.update();

    const updatedRows = wrapper.find(DataGrid).prop('rows');
    expect(
      updatedRows.every((row: any) => row.Status === 'Completed')
    ).toBeTruthy();
  });
});
