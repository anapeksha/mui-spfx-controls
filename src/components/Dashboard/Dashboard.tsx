import { Search } from '@mui/icons-material';
import { Box, IconButton, InputBase, Paper, Tab, Tabs } from '@mui/material';
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
import { ListService } from '../../services';
import { generateDashboardColumn } from '../../utils';
import { IDashboardProps, ITabSchema } from './IDashboardProps';

interface ICustomGridToolbarProps {
  loading: boolean;
  columnAction: boolean;
  densityAction: boolean;
  filterAction: boolean;
  exportAction: boolean;
  tabAction: boolean;
  searchAction: boolean;
  tabValue?: ITabSchema[];
  currentTabValue: ITabSchema;
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
  onTabChange,
  onQueryChange,
  onSearch,
}: ICustomGridToolbarProps): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" rowGap={1}>
      {columnAction || densityAction || filterAction || exportAction ? (
        <GridToolbarContainer>
          {columnAction ? <GridToolbarColumnsButton /> : null}
          {densityAction ? <GridToolbarDensitySelector /> : null}
          {filterAction ? <GridToolbarFilterButton /> : null}
          {exportAction ? <GridToolbarExport /> : null}
        </GridToolbarContainer>
      ) : null}
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
                  key={index}
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
  const [rows, setRows] = useState<any[]>([]);
  const [cachedRows, setCachedRows] = useState<any[]>([]);
  const [currentTabValue, setCurrentTabValue] = useState<
    ITabSchema | undefined
  >(tabValue ? tabValue[0] : undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

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
            tempColumns[index] = generateDashboardColumn(value);
          }
        });
        setColumns(() =>
          currentTabValue
            ? tempColumns
            : [...response].map((value) => generateDashboardColumn(value))
        );
        setCachedColumns(
          [...response].map((value) => generateDashboardColumn(value))
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

  return (
    <Box
      height={!isNaN(Number(height)) ? Number(height) : height || 500}
      padding={3}
    >
      <DataGrid
        loading={loading}
        getRowId={(row) => row.Id}
        getRowHeight={() => 'auto'}
        columns={columns}
        rows={rows}
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
            onTabChange: handleTabChange,
            onQueryChange: handleSearchQueryChange,
            onSearch: handleSearch,
          },
        }}
        sx={sx}
      />
    </Box>
  );
};

export default Dashboard;
