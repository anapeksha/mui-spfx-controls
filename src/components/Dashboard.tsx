import { Cancel, Edit, Save } from '@mui/icons-material';
import { Box, Button, Fade } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowId,
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
  const [initialRows, setInitialRows] = useState<any[]>([]);
  const [cachedRows, setCachedRows] = useState<GridRowProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editedRowIds, setEditedRowIds] = useState<GridRowId[]>([]);
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
          .getListItems(response[1])
          .then((itemResponse) => {
            setInitialRows(itemResponse);
            setCachedRows(itemResponse);
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
            <Fade in={editable}>
              <Box>
                <Button
                  size="small"
                  onClick={() => {
                    setLoading(true);
                    const editedRows = editedRowIds.map((id) =>
                      apiRef.current.getRowWithUpdatedValues(id, '')
                    );
                    listService
                      .batchedUpdateListItems(editedRows)
                      .then(() => {
                        listService
                          .getListItems(fieldInfo)
                          .then((itemResponse) => {
                            apiRef.current.setRows(itemResponse);
                            setCachedRows(itemResponse);
                            setLoading(false);
                            setEditable(false);
                          })
                          .catch((error) => {
                            Logger.error(error);
                          });
                      })
                      .catch((error) => {
                        Logger.error(error);
                      });
                  }}
                  startIcon={<Save />}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    apiRef.current.setRows(cachedRows);
                    setEditable(false);
                  }}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              </Box>
            </Fade>
          ) : (
            <Fade in={!editable}>
              <Button
                size="small"
                onClick={() => {
                  setEditable(() => true);
                  apiRef.current.setCellFocus(
                    initialRows[0].Id,
                    columns[0].field
                  );
                }}
                startIcon={<Edit />}
              >
                Edit
              </Button>
            </Fade>
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
        rows={initialRows}
        onRowEditStart={(params) => {
          setEditedRowIds([...editedRowIds, params.id]);
        }}
        slots={{ toolbar: CustomGridToolbar }}
        sx={sx}
      />
    </Box>
  );
};

export default Dashboard;
