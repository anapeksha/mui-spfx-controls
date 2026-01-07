import {
  Cancel,
  Check,
  Close,
  FileDownload,
  FilterList,
  Search,
  TableRows,
  ViewColumn,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Divider,
  Fade,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ColumnsPanelTrigger,
  DataGrid,
  ExportCsv,
  ExportPrint,
  FilterPanelTrigger,
  GridColDef,
  GridDensity,
  GridToolbarProps,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  Toolbar,
  ToolbarButton,
} from '@mui/x-data-grid';
import { Logger } from '@pnp/logging';
import * as React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import { ListService } from '../../services/ListService';
import { generateDashboardColumn } from '../../utils/generateDashboardColumn';
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
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  onTabChange: (tabValue: ITabSchema | undefined) => void;
}

type OwnerState = {
  expanded: boolean;
};

const DENSITY_OPTIONS: { label: string; value: GridDensity }[] = [
  { label: 'Compact density', value: 'compact' },
  { label: 'Standard density', value: 'standard' },
  { label: 'Comfortable density', value: 'comfortable' },
];

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
});

const StyledToolbarButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState: OwnerState }>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  width: 'min-content',
  height: 'min-content',
  zIndex: 1,
  opacity: ownerState.expanded ? 0 : 1,
  pointerEvents: ownerState.expanded ? 'none' : 'auto',
  transition: theme.transitions.create(['opacity']),
}));

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
}));

const CustomGridToolbar: FC<ICustomGridToolbarProps> = ({
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
  density,
  onDensityChange,
  onTabChange,
}) => {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [densityMenuOpen, setDensityMenuOpen] = useState(false);
  const exportMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const densityMenuTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Box display="flex" flexDirection="column" rowGap={1}>
      {columnAction ||
      densityAction ||
      filterAction ||
      exportAction ||
      searchAction ? (
        <Toolbar style={{ display: 'flex', alignItems: 'center' }}>
          {updateMessage ? (
            <Box>
              <Fade in timeout={500}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
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
          {columnAction ? (
            <Tooltip title="Columns">
              <ColumnsPanelTrigger render={<ToolbarButton />}>
                <ViewColumn fontSize="small" />
              </ColumnsPanelTrigger>
            </Tooltip>
          ) : null}
          {densityAction ? (
            <>
              <Tooltip title="Density">
                <ToolbarButton
                  ref={densityMenuTriggerRef}
                  id="density-menu-trigger"
                  aria-controls="density-menu"
                  aria-haspopup="true"
                  aria-expanded={densityMenuOpen ? 'true' : undefined}
                  onClick={() => setDensityMenuOpen(true)}
                >
                  <TableRows fontSize="small" />
                </ToolbarButton>
              </Tooltip>

              <Menu
                id="export-menu"
                anchorEl={densityMenuTriggerRef.current}
                open={densityMenuOpen}
                onClose={() => setDensityMenuOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  list: {
                    'aria-labelledby': 'export-menu-trigger',
                  },
                }}
              >
                {DENSITY_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    selected={density === option.value}
                    onClick={() => onDensityChange(option.value)}
                  >
                    <ListItemIcon>
                      {density === option.value && <Check fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText>{option.label}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : null}
          {filterAction ? (
            <Tooltip title="Filters">
              <FilterPanelTrigger
                render={(props, state) => (
                  <ToolbarButton {...(props as any)} color="default">
                    <Badge
                      badgeContent={state.filterCount}
                      color="primary"
                      variant="dot"
                    >
                      <FilterList fontSize="small" />
                    </Badge>
                  </ToolbarButton>
                )}
              />
            </Tooltip>
          ) : null}
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ mx: 0.5 }}
          />
          {exportAction ? (
            <>
              <Tooltip title="Export">
                <ToolbarButton
                  ref={exportMenuTriggerRef}
                  id="export-menu-trigger"
                  aria-controls="export-menu"
                  aria-haspopup="true"
                  aria-expanded={exportMenuOpen ? 'true' : undefined}
                  onClick={() => setExportMenuOpen(true)}
                >
                  <FileDownload fontSize="small" />
                </ToolbarButton>
              </Tooltip>

              <Menu
                id="export-menu"
                anchorEl={exportMenuTriggerRef.current}
                open={exportMenuOpen}
                onClose={() => setExportMenuOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  list: {
                    'aria-labelledby': 'export-menu-trigger',
                  },
                }}
              >
                <ExportPrint
                  render={<MenuItem />}
                  onClick={() => setExportMenuOpen(false)}
                >
                  Print
                </ExportPrint>
                <ExportCsv
                  render={<MenuItem />}
                  onClick={() => setExportMenuOpen(false)}
                >
                  Download as CSV
                </ExportCsv>
              </Menu>
            </>
          ) : null}
          {searchAction ? (
            <StyledQuickFilter>
              <QuickFilterTrigger
                render={(triggerProps, state) => (
                  <Tooltip title="Search" enterDelay={0}>
                    <StyledToolbarButton
                      {...triggerProps}
                      ownerState={{ expanded: state.expanded }}
                      color="default"
                      aria-disabled={state.expanded}
                    >
                      <Search fontSize="small" />
                    </StyledToolbarButton>
                  </Tooltip>
                )}
              />
              <QuickFilterControl
                render={({ ref, ...controlProps }, state) => (
                  <StyledTextField
                    {...controlProps}
                    ownerState={{ expanded: state.expanded }}
                    inputRef={ref}
                    aria-label="Search"
                    placeholder="Search..."
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: state.value ? (
                          <InputAdornment position="end">
                            <QuickFilterClear
                              edge="end"
                              size="small"
                              aria-label="Clear search"
                              material={{ sx: { marginRight: -0.75 } }}
                            >
                              <Cancel fontSize="small" />
                            </QuickFilterClear>
                          </InputAdornment>
                        ) : null,
                        ...controlProps.slotProps?.input,
                      },
                      ...controlProps.slotProps,
                    }}
                  />
                )}
              />
            </StyledQuickFilter>
          ) : null}
        </Toolbar>
      ) : null}
      {tabAction ? (
        <Toolbar>
          <Tabs
            value={currentTabValue}
            onChange={(event, value) => onTabChange(value)}
            variant="scrollable"
          >
            {tabValue
              ? tabValue.map((value, index) => (
                  <Tab
                    key={`${value.label}-${index}`}
                    label={value.label}
                    value={value}
                    disabled={value.disabled || loading}
                    wrapped={value.wrapped}
                    icon={value.icon}
                    iconPosition={value.iconPosition}
                  />
                ))
              : null}
          </Tabs>
        </Toolbar>
      ) : null}
    </Box>
  );
};

const Dashboard: React.ForwardRefExoticComponent<IDashboardProps> =
  React.forwardRef(
    (
      {
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
      },
      ref: React.ForwardedRef<HTMLDivElement>
    ) => {
      const listService = new ListService(context, list);
      const [columns, setColumns] = useState<GridColDef[]>([]);
      const [cachedColumns, setCachedColumns] = useState<GridColDef[]>([]);
      const [rows, setRows] = useState<Record<string, any>[]>([]);
      const [cachedRows, setCachedRows] = useState<any[]>([]);
      const [density, setDensity] = useState<GridDensity>('standard');
      const [currentTabValue, setCurrentTabValue] = useState<
        ITabSchema | undefined
      >(tabValue ? tabValue[0] : undefined);
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
                  !value.ReadOnlyField && editable,
                  resizable
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
                      !value.ReadOnlyField && editable,
                      resizable
                    )
                  )
            );
            setCachedColumns(
              [...response].map((value) =>
                generateDashboardColumn(
                  context,
                  value,
                  !value.ReadOnlyField && editable,
                  resizable
                )
              )
            );
            listService
              .getListItems(response, '', 'Created')
              .then((itemResponse) => {
                setLoading(false);
                setRows(
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

      const handleTabChange = (
        currentTabValue: ITabSchema | undefined
      ): void => {
        const tempColumns: GridColDef[] = [];
        const filteredRows = currentTabValue
          ? [...cachedRows].filter((value) =>
              String(value[currentTabValue.fieldToMatch]).includes(
                currentTabValue.stringToMatch
              )
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
          Logger.error(error as Error);
          setUpdateMessage({ text: 'Error saving!', type: 'error' });
          return oldRow;
        } finally {
          setLoading(false);
          setTimeout(() => setUpdateMessage(null), 3000);
        }
      };

      const onDensityChange = (density: GridDensity): void => {
        setDensity(density);
      };

      return (
        <Box
          data-testid="mui-spfx-dashboard"
          ref={ref}
          height={!isNaN(Number(height)) ? Number(height) : height || 500}
        >
          <DataGrid
            loading={loading}
            getRowId={(row) => String(row.Id)}
            columns={columns}
            rows={rows}
            editMode="row"
            density={density}
            onDensityChange={onDensityChange}
            processRowUpdate={editable ? processRowUpdate : undefined}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            slots={{ toolbar: CustomGridToolbar as any }}
            showToolbar
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
                density: density,
                onDensityChange: onDensityChange,
                onTabChange: handleTabChange,
              } as ICustomGridToolbarProps,
            }}
            sx={sx}
          />
        </Box>
      );
    }
  );

export default Dashboard;
