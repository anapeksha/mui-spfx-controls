import { Check, Close, Search } from '@mui/icons-material';
import {
  Box,
  Fade,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarProps,
} from '@mui/x-data-grid';
import { Logger } from '@pnp/logging';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ListService } from '../../services';
import { generateDashboardColumn } from '../../utils';
import { IDashboardProps, ITabSchema } from './IDashboardProps';

interface ICustomGridToolbarProps extends GridToolbarProps {
  loading: boolean;
  columnAction: boolean;
  densityAction: boolean;
  filterAction: boolean;
  exportAction: boolean;
  tabAction: boolean;
  searchAction: boolean;
  tabValue?: ITabSchema[];
  currentTabValue: ITabSchema;
  updateMessage?: { text: string; type: 'success' | 'error' };
  onTabChange: (tabValue: ITabSchema | undefined) => void;
  onQueryChange: (newQuery: string) => void;
  onSearch: () => void;
}

const CustomGridToolbar = ({
  loading,
  columnAction,
  densityAction,
  filterAction,
  exportAction,
  tabAction,
  tabValue,
  currentTabValue,
  searchAction,
  updateMessage,
  onTabChange,
  onQueryChange,
  onSearch,
}: ICustomGridToolbarProps): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" rowGap={1}>
      {searchAction ? (
        <GridToolbarContainer>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
            variant="outlined"
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault();
              onSearch();
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(event) => onQueryChange(event.target.value)}
              fullWidth
            />
            <IconButton
              type="submit"
              sx={{ p: '10px' }}
              aria-label="search"
              color="primary"
            >
              <Search />
            </IconButton>
          </Paper>
        </GridToolbarContainer>
      ) : null}
      {columnAction || densityAction || filterAction || exportAction ? (
        <GridToolbarContainer sx={{ display: 'flex', alignItems: 'center' }}>
          {columnAction ? <GridToolbarColumnsButton /> : null}
          {densityAction ? <GridToolbarDensitySelector /> : null}
          {filterAction ? <GridToolbarFilterButton /> : null}
          {exportAction ? <GridToolbarExport /> : null}
          {updateMessage ? (
            <Box>
              <Fade in timeout={500}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    p: '4px 5px',
                  }}
                >
                  {updateMessage.type === 'success' ? (
                    <Check color="success" fontSize="small" />
                  ) : (
                    <Close color="error" fontSize="small" />
                  )}
                  <Typography
                    fontSize="small"
                    variant="button"
                    component="span"
                    sx={{
                      color: `${updateMessage.type}.main`,
                    }}
                  >
                    {updateMessage.text}
                  </Typography>
                </Box>
              </Fade>
            </Box>
          ) : null}
        </GridToolbarContainer>
      ) : null}
      {tabAction ? (
        <GridToolbarContainer>
          <Tabs
            value={currentTabValue}
            onChange={(event, value) => onTabChange(value)}
            variant="scrollable"
          >
            {tabValue &&
              tabValue.map((value, index) => (
                <Tab
                  key={`${value.label}-${index}`}
                  label={value.label}
                  value={value}
                  disabled={value.disabled || loading}
                  wrapped={value.wrapped}
                  icon={value.icon}
                  iconPosition={value.iconPosition}
                />
              ))}
          </Tabs>
        </GridToolbarContainer>
      ) : null}
    </Box>
  );
};

export const Dashboard: React.FC<IDashboardProps> = ({
  context,
  list,
  fields,
  tabAction,
  tabValue,
  editable,
  resizable,
  columnAction,
  densityAction,
  filterAction,
  exportAction,
  searchAction,
  height,
  sx,
}) => {
  const listService = new ListService(context, list);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [cachedColumns, setCachedColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [cachedRows, setCachedRows] = useState<any[]>([]);
  const [currentTabValue, setCurrentTabValue] = useState<
    ITabSchema | undefined
  >(tabValue ? tabValue[0] : undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    listService
      .getListFields(fields)
      .then((response) => {
        const tempColumns: GridColDef[] = [];
        [...response].forEach((value) => {
          const index = currentTabValue
            ? currentTabValue.displayFields.indexOf(value.InternalName)
            : -1;
          if (index !== -1) {
            tempColumns[index] = generateDashboardColumn(
              context,
              value,
              !value.ReadOnlyField && editable ? true : false,
              resizable ? true : false
            );
          }
        });
        setColumns(() =>
          currentTabValue
            ? tempColumns
            : [...response].map((value) =>
                generateDashboardColumn(
                  context,
                  value,
                  !value.ReadOnlyField && editable ? true : false,
                  resizable ? true : false
                )
              )
        );
        setCachedColumns(
          [...response].map((value) =>
            generateDashboardColumn(
              context,
              value,
              !value.ReadOnlyField && editable ? true : false,
              resizable ? true : false
            )
          )
        );
        listService
          .getListItems(response, '', 'Created')
          .then((itemResponse) => {
            setLoading(false);
            setRows(() =>
              currentTabValue
                ? [...itemResponse].filter(
                    (value) =>
                      String(value[currentTabValue.fieldToMatch]).indexOf(
                        currentTabValue.stringToMatch
                      ) !== -1
                  )
                : [...itemResponse]
            );
            setCachedRows(itemResponse);
          })
          .catch((error) => {
            Logger.error(error);
          });
      })
      .catch((error) => {
        Logger.error(error);
      });
  }, [list, fields]);

  const handleTabChange = (currentTabValue: ITabSchema | undefined): void => {
    const tempColumns: GridColDef[] = [];
    const filteredRows = currentTabValue
      ? [...cachedRows].filter(
          (value) =>
            String(value[currentTabValue.fieldToMatch]).indexOf(
              currentTabValue.stringToMatch
            ) !== -1
        )
      : [...cachedRows];
    [...cachedColumns].forEach((value) => {
      const index = currentTabValue
        ? currentTabValue?.displayFields.indexOf(value.field)
        : -1;
      if (index !== -1) {
        tempColumns[index] = value;
      }
    });
    setColumns(tempColumns);
    setRows(filteredRows);
    setCurrentTabValue(currentTabValue);
  };

  const handleSearch = (): void => {
    const filteredRows = [...cachedRows].filter((row: any) =>
      fields.some(
        (field) =>
          row[field] &&
          String(row[field])
            .toLowerCase()
            .indexOf(searchQuery.toLowerCase()) !== -1
      )
    );
    setRows(filteredRows);
  };

  const handleSearchQueryChange = (newQuery: string): void => {
    setSearchQuery(newQuery);
    if (newQuery.length === 0) {
      setRows(() =>
        currentTabValue
          ? [...cachedRows].filter(
              (value) =>
                value[currentTabValue.fieldToMatch] ===
                currentTabValue.stringToMatch
            )
          : [...cachedRows]
      );
    }
  };

  const processRowUpdate = async (
    newRow: Record<string, any>,
    oldRow: Record<string, any>
  ): Promise<Record<string, any>> => {
    const rowId = Number(oldRow.Id);
    setLoading(true);
    try {
      await listService.updateListItem(rowId, newRow);
      setUpdateMessage({ text: 'Changes saved!', type: 'success' });
      return newRow;
    } catch (error) {
      Logger.error(error);
      setUpdateMessage({ text: 'Error saving!', type: 'error' });
      return oldRow;
    } finally {
      setLoading(false);
      setTimeout(() => setUpdateMessage(null), 3000);
    }
  };

  return (
    <Box height={!isNaN(Number(height)) ? Number(height) : height || 500}>
      <DataGrid
        loading={loading}
        getRowId={(row) => String(row.Id)}
        columns={columns}
        rows={rows}
        editMode="row"
        processRowUpdate={editable ? processRowUpdate : undefined}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        slots={{ toolbar: CustomGridToolbar }}
        slotProps={{
          toolbar: {
            loading: loading,
            columnAction: columnAction,
            densityAction: densityAction,
            filterAction: filterAction,
            exportAction: exportAction,
            tabAction: tabAction,
            searchAction: searchAction,
            tabValue: tabValue,
            currentTabValue: currentTabValue,
            updateMessage: updateMessage,
            onTabChange: handleTabChange,
            onQueryChange: handleSearchQueryChange,
            onSearch: handleSearch,
          } as ICustomGridToolbarProps,
        }}
        sx={sx}
      />
    </Box>
  );
};

export default Dashboard;
