import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridRowProps,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { IDashboardProps } from '../types';
import { ListService } from '../services';
import { GridColDef } from '@mui/x-data-grid';
import { generateDashboardColumn } from '../utils';

const CustomGridToolbar = (): JSX.Element => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
};

export const Dashboard: React.FC<IDashboardProps> = ({
  context,
  list,
  fields,
  height,
}) => {
  const listService = new ListService(context, list);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<GridRowProps[]>([]);
  const [loading, setLoading] = useState(false);

  console.log(height);

  useEffect(() => {
    setLoading(true);
    listService
      .getListFields(fields)
      .then((fieldResponse) => {
        setColumns(
          fieldResponse.map((value) => generateDashboardColumn(value, context))
        );
        listService
          .getListItems(fieldResponse)
          .then((itemResponse) => {
            console.log(itemResponse);
            setRows(itemResponse);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [list, fields]);

  return (
    <Box
      height={!isNaN(Number(height)) ? Number(height) : height || 500}
      width="100%"
    >
      <DataGrid
        loading={loading}
        getRowId={(row) => row.Id}
        columns={columns}
        rows={rows}
        slots={{ toolbar: CustomGridToolbar }}
      />
    </Box>
  );
};

export default Dashboard;
