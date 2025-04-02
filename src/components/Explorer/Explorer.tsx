import {
  Add,
  Folder,
  Grid3x3,
  Home,
  InsertDriveFile,
  List as ListIcon,
} from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Grid2 as Grid,
  InputBase,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import React, {
  ChangeEventHandler,
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  MouseEventHandler,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { DefaultExtensionType, defaultStyles, FileIcon } from 'react-file-icon';
import { LibraryService, Permission } from '../../services/LibraryService';
import { IExplorerProps } from './IExplorerProps';

dayjs.extend(advancedFormat);

type DisplayType = 'grid' | 'list';

interface IToolbarProps {
  displayType: DisplayType;
  permissions: Permission[];
  onNewFolderCreate: () => void;
  onDisplayTypeChange: (displayType: DisplayType) => void;
}

interface INewFolderProps {
  displayType: DisplayType;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onCancel: () => void;
}

interface IBreadcrumbData {
  Name: string;
  ServerRelativeUrl: string;
}

interface ICreateNewFolderData {
  open: boolean;
  value: string;
}

interface IViewProps {
  items: any[];
  newFolder: ICreateNewFolderData;
  onNewFolderNameChange: (newName: string) => void;
  onNewFolderDismiss: () => void;
  onNewFolderSave: () => void;
  onFolderClick: (item: IBreadcrumbData) => void;
  onFileClick: (item: IBreadcrumbData) => void;
}

interface IItemDefaultProps {
  onClick?: MouseEventHandler<HTMLElement>;
}

const NewFolder: FC<INewFolderProps> = ({
  displayType,
  value,
  onChange,
  onCancel,
}) => {
  return (
    <>
      {displayType === 'grid' ? (
        <Grid>
          <Card
            variant="outlined"
            sx={{ width: 150, borderWidth: 2, borderColor: 'primary.main' }}
            onBlur={(event) => {
              event.preventDefault();
              onCancel();
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Folder fontSize="large" color="primary" />
              <InputBase value={value} onChange={onChange} autoFocus />
            </CardContent>
          </Card>
        </Grid>
      ) : null}
      {displayType === 'list' ? (
        <ListItemButton
          disableRipple
          selected
          onBlur={(event) => {
            event.preventDefault();
            onCancel();
          }}
        >
          <ListItemIcon>
            <Folder color="primary" />
          </ListItemIcon>
          <InputBase value={value} onChange={onChange} fullWidth autoFocus />
        </ListItemButton>
      ) : null}
    </>
  );
};

const Toolbar: FC<IToolbarProps> = ({
  displayType,
  permissions,
  onNewFolderCreate,
  onDisplayTypeChange,
}) => {
  return (
    <Stack direction="row" spacing={1}>
      {permissions.includes(Permission.Add) ? (
        <Button startIcon={<Add />} size="small" onClick={onNewFolderCreate}>
          New Folder
        </Button>
      ) : null}
      <ToggleButtonGroup
        size="small"
        aria-label="display-type"
        value={displayType}
        exclusive
        onChange={(event, newValue) => onDisplayTypeChange(newValue)}
      >
        <ToggleButton value="grid">
          <Grid3x3 />
        </ToggleButton>
        <ToggleButton value="list">
          <ListIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};

const GridView: FC<IViewProps> = ({
  items,
  newFolder,
  onNewFolderSave,
  onNewFolderDismiss,
  onNewFolderNameChange,
  onFolderClick,
  onFileClick,
}) => {
  return (
    <Grid container spacing={1} width="100%" overflow="auto">
      {newFolder.open ? (
        <NewFolder
          displayType="grid"
          value={newFolder.value}
          onChange={(event) => onNewFolderNameChange(event.target.value)}
          onCancel={onNewFolderDismiss}
        />
      ) : null}
      {items.map((item) => {
        let props: IItemDefaultProps = {
          onClick: undefined,
        };

        if (item.Type === 'folder') {
          props = {
            ...props,
            onClick: () =>
              onFolderClick({
                Name: item.Name,
                ServerRelativeUrl: item.ServerRelativeUrl,
              }),
          };
        }

        if (item.Type === 'file') {
          props = {
            ...props,
            onClick: () =>
              onFileClick({
                Name: item.Name,
                ServerRelativeUrl: item.ServerRelativeUrl,
              }),
          };
        }

        const renderIcon = (): JSX.Element => {
          return item.Extension !== 'unknown' ? (
            <SvgIcon fontSize="large">
              <FileIcon
                extension={item.Extension}
                type="vector"
                {...defaultStyles[item.Extension as DefaultExtensionType]}
              />
            </SvgIcon>
          ) : (
            <InsertDriveFile color="primary" />
          );
        };

        return (
          <Grid key={item.Name}>
            <Card variant="outlined" sx={{ width: 150 }}>
              <CardActionArea {...props}>
                <CardContent sx={{ textAlign: 'center' }}>
                  {item.Type === 'folder' ? (
                    <Folder fontSize="large" color="primary" />
                  ) : null}
                  {item.Type === 'file' ? renderIcon() : null}
                  <Typography
                    noWrap
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {item.Name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {dayjs(item.TimeLastModified).format('Do MMMM')}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

const ListView: FC<IViewProps> = ({
  items,
  newFolder,
  onNewFolderSave,
  onNewFolderDismiss,
  onNewFolderNameChange,
  onFolderClick,
  onFileClick,
}) => {
  return (
    <List
      sx={{
        overflow: 'auto',
      }}
    >
      {newFolder.open ? (
        <NewFolder
          displayType="list"
          value={newFolder.value}
          onChange={(event) => onNewFolderNameChange(event.target.value)}
          onCancel={onNewFolderDismiss}
        />
      ) : null}
      {items.map((item) => {
        let props: IItemDefaultProps = {
          onClick: undefined,
        };

        if (item.Type === 'folder') {
          props = {
            ...props,
            onClick: () =>
              onFolderClick({
                Name: item.Name,
                ServerRelativeUrl: item.ServerRelativeUrl,
              }),
          };
        }

        if (item.Type === 'file') {
          props = {
            ...props,
            onClick: () =>
              onFileClick({
                Name: item.Name,
                ServerRelativeUrl: item.ServerRelativeUrl,
              }),
          };
        }

        const renderIcon = (): JSX.Element => {
          return item.Extension !== 'unknown' ? (
            <SvgIcon>
              <FileIcon
                extension={item.Extension}
                type="vector"
                {...defaultStyles[item.Extension as DefaultExtensionType]}
              />
            </SvgIcon>
          ) : (
            <InsertDriveFile color="primary" />
          );
        };

        return (
          <ListItemButton key={item.UniqueId} {...props} disableRipple>
            <ListItemIcon>
              {item.Type === 'folder' ? <Folder color="primary" /> : null}
              {item.Type === 'file' ? renderIcon() : null}
            </ListItemIcon>
            <ListItemText
              primary={item.Name}
              secondary={dayjs(item.TimeLastModified).format('Do MMMM')}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

const Explorer: ForwardRefExoticComponent<IExplorerProps> = forwardRef(
  (
    { context, library, defaultDisplayType, height, onFileOpen },
    ref: RefObject<HTMLDivElement>
  ) => {
    const [displayType, setDisplayType] = useState<DisplayType>(
      defaultDisplayType || 'grid'
    );
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [breadcrumbData, setBreadcrumbData] = useState<IBreadcrumbData[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [initial, setInitial] = useState(true);
    const [createNewFolder, setCreateNewFolder] =
      useState<ICreateNewFolderData>({
        open: false,
        value: '',
      });
    const libraryService = new LibraryService(context);

    const fetchItems = async (libraryUrl: string): Promise<void> => {
      setLoading(true);
      try {
        const items = await libraryService.getLibraryItems(libraryUrl);
        setItems(items);
        console.log(items);
        if (initial) {
          setBreadcrumbData([
            ...breadcrumbData,
            {
              Name: library.title as string,
              ServerRelativeUrl: library.url as string,
            },
          ]);
          setInitial(false);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPermissions = async (): Promise<void> => {
      setLoading(true);
      try {
        const tempPermissions = await libraryService.getEffectivePermissions(
          library.id
        );
        setPermissions(tempPermissions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleDisplayTypeChange = (newValue: DisplayType): void => {
      if (newValue) {
        setDisplayType(newValue);
        setCreateNewFolder({ ...createNewFolder, open: false, value: '' });
      }
    };

    const handleFolderClick = (item: IBreadcrumbData): void => {
      fetchItems(item.ServerRelativeUrl);
      setBreadcrumbData([...breadcrumbData, item]);
    };

    const handleFileClick = (item: IBreadcrumbData): void => {
      window.open(`${item.ServerRelativeUrl}?web=1`);
    };

    const handleBreadcrumbClick = (
      item: IBreadcrumbData,
      index: number
    ): void => {
      const tempBreadcrumbData = [...breadcrumbData];
      tempBreadcrumbData.splice(index + 1);
      fetchItems(item.ServerRelativeUrl);
      setBreadcrumbData(tempBreadcrumbData);
    };

    const handleNewFolderClick = (): void => {
      setCreateNewFolder({ ...createNewFolder, open: true, value: '' });
    };

    const handleNewFolderNameChange = (newName: string): void => {
      setCreateNewFolder({ ...createNewFolder, value: newName });
    };

    const handleNewFolderDismiss = (): void => {
      setCreateNewFolder({ ...createNewFolder, open: false, value: '' });
    };

    useEffect(() => {
      Promise.all([fetchPermissions(), fetchItems(library.url as string)]);
    }, [library]);

    const errorOrLoading = error || loading;
    const itemsHaveValue = items && items.length !== 0;
    const itemsDoNotHaveValue = items && items.length === 0;

    return (
      <Paper ref={ref} variant="outlined">
        <Stack flexDirection="column" spacing={2} padding={2}>
          <Toolbar
            displayType={displayType}
            permissions={permissions}
            onNewFolderCreate={handleNewFolderClick}
            onDisplayTypeChange={handleDisplayTypeChange}
          />
          <Divider />
          {breadcrumbData && breadcrumbData.length !== 0 ? (
            <Box sx={{ width: '100%' }}>
              <Breadcrumbs>
                {breadcrumbData.map((item, index) =>
                  index !== breadcrumbData.length - 1 ? (
                    <Link
                      href="#"
                      underline="hover"
                      key={`${item.Name}-${index}`}
                      sx={{ display: 'flex', alignItems: 'center' }}
                      onClick={() => handleBreadcrumbClick(item, index)}
                    >
                      {index === 0 ? (
                        <Home fontSize="inherit" sx={{ mr: 0.5 }} />
                      ) : null}
                      {item.Name}
                    </Link>
                  ) : (
                    <Typography
                      key={`${item.Name}-${index}`}
                      color="textDisabled"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {index === 0 ? (
                        <Home fontSize="inherit" sx={{ mr: 0.5 }} />
                      ) : null}
                      {item.Name}
                    </Typography>
                  )
                )}
              </Breadcrumbs>
            </Box>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: height || 500,
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress thickness={4} />
              </Box>
            ) : null}
            {error ? (
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography color="error" sx={{ justifySelf: 'center' }}>
                  {error}
                </Typography>
              </Box>
            ) : null}
            {!errorOrLoading && itemsHaveValue && displayType === 'grid' ? (
              <GridView
                items={items}
                newFolder={createNewFolder}
                onNewFolderSave={() => {}}
                onNewFolderDismiss={handleNewFolderDismiss}
                onNewFolderNameChange={handleNewFolderNameChange}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
              />
            ) : null}
            {!errorOrLoading && itemsHaveValue && displayType === 'list' ? (
              <ListView
                items={items}
                newFolder={createNewFolder}
                onNewFolderSave={() => {}}
                onNewFolderDismiss={handleNewFolderDismiss}
                onNewFolderNameChange={handleNewFolderNameChange}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
              />
            ) : null}
            {!errorOrLoading && itemsDoNotHaveValue ? (
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography>This folder is empty</Typography>
              </Box>
            ) : null}
          </Box>
        </Stack>
      </Paper>
    );
  }
);

export default Explorer;
