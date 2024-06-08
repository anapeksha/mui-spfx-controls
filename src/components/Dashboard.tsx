import { Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowProps,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { Logger } from '@pnp/logging';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { ListService } from '../services';
import { IDashboardProps } from '../types';
import { generateDashboardColumn } from '../utils';

const CustomGridToolbar = (): JSX.Element => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
};

export const Dashboard: React.FC<IDashboardProps> = ({
  context,
  list,
  fields,
  height,
  sx,
}) => {
  const listService = new ListService(context, list);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<GridRowProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useMemo(() => {
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
            setRows(itemResponse);
            setLoading(false);
          })
          .catch((error) => {
            Logger.error(error.message);
          });
      })
      .catch((error) => {
        Logger.error(error.message);
      });
  }, [list, fields]);

  useMemo(() => {
    // console.log(page, rowsPerPage);
  }, [page, rowsPerPage]);

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
        slotProps={{
          pagination: {
            page,
            rowsPerPage,
            onPageChange(event, page) {
              setPage(page);
            },
            onRowsPerPageChange(event) {
              setRowsPerPage(Number(event.target.value));
              setPage(0);
            },
          },
        }}
        sx={sx}
      />
    </Box>
  );
};

export default Dashboard;
