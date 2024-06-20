import { Cancel, Edit, Save } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowProps,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiRef,
} from '@mui/x-data-grid';
import { Logger } from '@pnp/logging';
import { IFieldInfo } from '@pnp/sp/fields';
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
  const [fieldInfo, setFieldInfo] = useState<IFieldInfo[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<GridRowProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [editable, setEditable] = useState(false);
  const apiRef = useGridApiRef();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      listService.checkListPermission(),
      listService.getListFields(fields),
    ])
      .then((response) => {
        setHasEditPermission(response[0]);
        setFieldInfo(response[1]);
        setColumns(
          response[1].map((value) =>
            generateDashboardColumn(value, context, editable)
          )
        );
        listService
          .getListItems(response[1], page, rowsPerPage)
          .then((itemResponse) => {
            setRows(itemResponse);
            setLoading(false);
          })
          .catch((error) => {
            Logger.error(error.message);
          });
      })
      .catch((error) => {
        Logger.error(error);
      });
  }, [list, fields]);

  useEffect(() => {
    setColumns(
      fieldInfo.map((value) =>
        generateDashboardColumn(value, context, editable)
      )
    );
  }, [editable]);

  const CustomGridToolbar = (): JSX.Element => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarFilterButton />
        <GridToolbarExport />
        {hasEditPermission ? (
          editable ? (
            <>
              <Button
                size="small"
                onClick={() => {
                  setEditable(false);
                }}
                startIcon={<Save />}
              >
                Save
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setEditable(false);
                }}
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              size="small"
              onClick={() => {
                setEditable(() => true);
                apiRef.current.setCellFocus(rows[0].Id, columns[0].field);
              }}
              startIcon={<Edit />}
            >
              Edit
            </Button>
          )
        ) : null}
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
        editMode="row"
        getRowId={(row) => row.Id}
        apiRef={apiRef}
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
