import {
  Add,
  Delete,
  Folder,
  Grid3x3,
  Home,
  InsertDriveFile,
  List as ListIcon,
  PermIdentity,
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
  Fade,
  Grid2 as Grid,
  InputBase,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
  onSave: () => void;
}

interface IBreadcrumbData {
  Name: string;
  ServerRelativeUrl: string;
}

interface ICreateNewFolderData {
  open: boolean;
  value: string;
}

interface IItemDefaultProps {
  onClick?: MouseEventHandler<HTMLElement>;
}

interface IMenuState {
  open: boolean;
  element: Element | null;
  value: { Id: string; ServerRelativeUrl: string };
}

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

const NewFolder: FC<INewFolderProps> = ({
  displayType,
  value,
  onChange,
  onCancel,
  onSave,
}) => {
  return (
    <>
      {displayType === 'grid' ? (
        <Fade in timeout={300}>
          <Grid>
            <Card
              variant="outlined"
              sx={{ width: 150, borderWidth: 2, borderColor: 'primary.main' }}
              onBlur={(event) => {
                onCancel();
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Folder fontSize="large" color="primary" />
                <InputBase
                  value={value}
                  onChange={onChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      onSave();
                    }
                    if (event.key === 'Escape') {
                      onCancel();
                    }
                  }}
                  autoFocus
                  fullWidth
                />
              </CardContent>
            </Card>
          </Grid>
        </Fade>
      ) : null}
      {displayType === 'list' ? (
        <Fade in timeout={300}>
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
            <InputBase
              value={value}
              onChange={onChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSave();
                }
                if (event.key === 'Escape') {
                  onCancel();
                }
              }}
              fullWidth
              autoFocus
            />
          </ListItemButton>
        </Fade>
      ) : null}
    </>
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
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [createNewFolder, setCreateNewFolder] =
      useState<ICreateNewFolderData>({
        open: false,
        value: '',
      });
    const [currentFolder, setCurrentFolder] = useState<IMenuState>({
      open: false,
      element: null,
      value: { Id: '', ServerRelativeUrl: '' },
    });
    const libraryService = new LibraryService(context);

    const fetchItems = async (libraryUrl: string): Promise<void> => {
      setLoading(true);
      try {
        const items = await libraryService.getLibraryItems(libraryUrl);
        setItems(items);
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

    const createFolder = async (): Promise<void> => {
      setLoading(true);
      setIsFadingOut(true);
      try {
        await libraryService.createNewFolder(
          breadcrumbData[breadcrumbData.length - 1].ServerRelativeUrl,
          createNewFolder.value
        );
        await fetchItems(
          breadcrumbData[breadcrumbData.length - 1].ServerRelativeUrl
        );
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
      if (isFadingOut) {
        setCreateNewFolder((prevValue) => ({
          open: false,
          value: '',
        }));
      } else {
        setCreateNewFolder((prevValue) => ({
          open: !prevValue.open,
          value: '',
        }));
      }
    };

    const handleNewFolderNameChange = (newName: string): void => {
      setCreateNewFolder({ ...createNewFolder, value: newName });
    };

    const handleNewFolderSave = (): void => {
      createFolder();
      setIsFadingOut(false);
      setCreateNewFolder({ ...createNewFolder, open: false, value: '' });
    };

    const handleNewFolderDismiss = (): void => {
      setIsFadingOut(true);
      setTimeout(() => {
        setCreateNewFolder({ open: false, value: '' });
        setIsFadingOut(false);
      }, 300);
    };

    const handleOpenPermission = (): void => {
      const permissionsUrl = `${context.pageContext.web.absoluteUrl}/_layouts/15/user.aspx?obj=${library.id},doclib&List=${library.id}"`;
      window.open(permissionsUrl);
      setCurrentFolder({
        open: false,
        element: null,
        value: { Id: '', ServerRelativeUrl: '' },
      });
    };

    useEffect(() => {
      Promise.all([fetchPermissions(), fetchItems(library.url as string)]);
    }, [library]);

    const errorOrLoading = error || loading;
    const itemsHaveValue = items && items.length !== 0;
    const itemsDoNotHaveValue = !loading && items && items.length === 0;

    return (
      <Paper ref={ref} variant="outlined">
        <Menu
          anchorEl={currentFolder.element}
          open={currentFolder.open}
          onClose={() => {
            setCurrentFolder({
              open: false,
              element: null,
              value: { Id: '', ServerRelativeUrl: '' },
            });
          }}
        >
          {permissions.includes(Permission.ManagePermissions) ? (
            <MenuItem onClick={handleOpenPermission}>
              <ListItemIcon>
                <PermIdentity />
              </ListItemIcon>
              <ListItemText>Permissions</ListItemText>
            </MenuItem>
          ) : null}
          <MenuItem>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
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
              <Grid container spacing={1} width="100%" overflow="auto">
                {createNewFolder.open && !isFadingOut ? (
                  <NewFolder
                    displayType="grid"
                    value={createNewFolder.value}
                    onChange={(event) =>
                      handleNewFolderNameChange(event.target.value)
                    }
                    onSave={handleNewFolderSave}
                    onCancel={handleNewFolderDismiss}
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
                        handleFolderClick({
                          Name: item.Name,
                          ServerRelativeUrl: item.ServerRelativeUrl,
                        }),
                    };
                  }

                  if (item.Type === 'file') {
                    props = {
                      ...props,
                      onClick: () =>
                        handleFileClick({
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
                          {...defaultStyles[
                            item.Extension as DefaultExtensionType
                          ]}
                        />
                      </SvgIcon>
                    ) : (
                      <InsertDriveFile color="primary" />
                    );
                  };

                  return (
                    <Grid
                      key={item.Name}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        setCurrentFolder({
                          open: true,
                          element: event.currentTarget,
                          value: {
                            Id: item.UniqueId,
                            ServerRelativeUrl: item.ServerRelativeUrl,
                          },
                        });
                        console.log(event.currentTarget, currentFolder);
                      }}
                    >
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
            ) : null}
            {!errorOrLoading && itemsHaveValue && displayType === 'list' ? (
              <List
                sx={{
                  overflow: 'auto',
                }}
              >
                {createNewFolder.open && !isFadingOut ? (
                  <NewFolder
                    displayType="list"
                    value={createNewFolder.value}
                    onChange={(event) =>
                      handleNewFolderNameChange(event.target.value)
                    }
                    onSave={handleNewFolderSave}
                    onCancel={handleNewFolderDismiss}
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
                        handleFolderClick({
                          Name: item.Name,
                          ServerRelativeUrl: item.ServerRelativeUrl,
                        }),
                    };
                  }

                  if (item.Type === 'file') {
                    props = {
                      ...props,
                      onClick: () =>
                        handleFileClick({
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
                          {...defaultStyles[
                            item.Extension as DefaultExtensionType
                          ]}
                        />
                      </SvgIcon>
                    ) : (
                      <InsertDriveFile color="primary" />
                    );
                  };

                  return (
                    <ListItemButton
                      key={item.UniqueId}
                      {...props}
                      disableRipple
                    >
                      <ListItemIcon>
                        {item.Type === 'folder' ? (
                          <Folder color="primary" />
                        ) : null}
                        {item.Type === 'file' ? renderIcon() : null}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.Name}
                        secondary={dayjs(item.TimeLastModified).format(
                          'Do MMMM'
                        )}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
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
