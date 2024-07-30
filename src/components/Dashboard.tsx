import { Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { Logger } from '@pnp/logging';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ListService } from '../services';
import { IDashboardProps } from '../types';
import { generateDashboardColumn } from '../utils';

export const Dashboard: React.FC<IDashboardProps> = ({
  context,
  list,
  fields,
  height,
  sx,
}) => {
  const listService = new ListService(context, list);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [initialRows, setInitialRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listService
      .getListFields(fields)
      .then((response) => {
        setColumns(response.map((value) => generateDashboardColumn(value)));
        listService
          .getListItems(response, '', 'Created')
          .then((itemResponse) => {
            setInitialRows(itemResponse);
            setLoading(false);
          })
          .catch((error) => {
            Logger.error(error);
          });
      })
      .catch((error) => {
        Logger.error(error);
      });
  }, [list, fields]);

  const CustomGridToolbar = (): JSX.Element => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

  return (
    <Box
      height={!isNaN(Number(height)) ? Number(height) : height || 500}
      width="100%"
    >
      <DataGrid
        loading={loading}
        getRowId={(row) => row.Id}
        columns={columns}
        rows={initialRows}
        slots={{ toolbar: CustomGridToolbar }}
        sx={sx}
      />
    </Box>
  );
};

export default Dashboard;
