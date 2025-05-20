import {
  Add,
  Close,
  Delete,
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
  CardActions,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  IconButton,
  InputBase,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TypographyProps,
} from '@mui/material';
import { Logger } from '@pnp/logging';
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
  useRef,
  useState,
} from 'react';
import { DefaultExtensionType, defaultStyles, FileIcon } from 'react-file-icon';
import { LibraryService, Permission } from '../../services/LibraryService';
import { IBreadcrumbData, IExplorerProps } from './IExplorerProps';

dayjs.extend(advancedFormat);

const MESSAGE_TIMEOUT = 3000;

type DisplayType = 'grid' | 'list';

interface IMessageState {
  type: TypographyProps['color'];
  message: string;
}

interface IToolbarProps {
  displayType: DisplayType;
  permissions: Permission[];
  message: IMessageState;
  selected: number[];
  onNewFolderCreate: () => void;
  onDisplayTypeChange: (displayType: DisplayType) => void;
  onSelectionCancel: () => void;
  onDelete: () => void;
}

interface INewFolderProps {
  displayType: DisplayType;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onCancel: () => void;
  onSave: () => void;
}

interface ICreateNewFolderData {
  open: boolean;
  value: string;
}

interface IItemDefaultProps {
  onClick?: MouseEventHandler<HTMLElement>;
}

const Toolbar: FC<IToolbarProps> = ({
  displayType,
  permissions,
  selected,
  message,
  onNewFolderCreate,
  onDisplayTypeChange,
  onSelectionCancel,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Stack direction="row" spacing={1}>
          {permissions.includes(Permission.Add) ? (
            <Button
              startIcon={<Add />}
              size="small"
              onClick={onNewFolderCreate}
            >
              New Folder
            </Button>
          ) : null}
          {permissions.includes(Permission.Delete) && selected.length !== 0 ? (
            <Fade in>
              <Button
                startIcon={<Delete />}
                size="small"
                color="error"
                onClick={onDelete}
              >
                Delete
              </Button>
            </Fade>
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
      </Box>
      <Box>
        {message ? (
          <Fade in={Boolean(message)} unmountOnExit>
            <Typography color={message.type}>{message.message}</Typography>
          </Fade>
        ) : null}
        {selected.length !== 0 && !message ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={onSelectionCancel} size="small">
              <Close />
            </IconButton>
            <Typography>{selected.length} selected</Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
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
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <Card
              variant="outlined"
              sx={{
                borderWidth: 2,
                borderColor: 'primary.main',
                height: '100%',
              }}
              onBlur={() => {
                onCancel();
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%',
                }}
              >
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
                  sx={{
                    width: '100%',
                  }}
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
      defaultDisplayType ?? 'grid'
    );
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(!!library);
    const [error, setError] = useState<string | null>(null);
    const [breadcrumbData, setBreadcrumbData] = useState<IBreadcrumbData[]>([]);
    const [message, setMessage] = useState<IMessageState | null>(null);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [initial, setInitial] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [createNewFolder, setCreateNewFolder] =
      useState<ICreateNewFolderData>({
        open: false,
        value: '',
      });
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const libraryService = new LibraryService(context);

    const handleSelectionCancel = (): void => {
      setSelected([]);
    };

    const fetchItems = async (libraryUrl: string): Promise<void> => {
      setLoading(true);
      try {
        const items = await libraryService.getLibraryItems(libraryUrl);
        setItems(items);
        if (initial) {
          setBreadcrumbData([
            ...breadcrumbData,
            {
              Name: library?.title as string,
              ServerRelativeUrl: library?.url as string,
            },
          ]);
          setInitial(false);
        }
        setError(null);
        handleSelectionCancel();
      } catch (err) {
        setError(err.message);
        Logger.error(err);
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
        Logger.error(err);
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
        handleSelectionCancel();
      } catch (err) {
        setError(err.message);
        Logger.error(err);
      } finally {
        setLoading(false);
      }
    };

    const deleteItem = async (): Promise<void> => {
      setLoading(true);
      try {
        await libraryService.recycleItems(library?.id, selected);
        handleSelectionCancel();
        setMessage({ type: 'success', message: 'Item(s) deleted' });
        setTimeout(() => {
          setMessage(null);
        }, MESSAGE_TIMEOUT);
      } catch (err) {
        setError(err.message);
        Logger.error(err);
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
      if (onFileOpen && typeof onFileOpen === 'function') {
        onFileOpen(item);
      } else {
        window.open(`${item.ServerRelativeUrl}?web=1`);
      }
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
        setCreateNewFolder(() => ({
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

    const handleItemsDelete = async (): Promise<void> => {
      await deleteItem();
      await fetchItems(
        breadcrumbData[breadcrumbData.length - 1].ServerRelativeUrl
      );
    };

    const handleItemSelection = (id: number): void => {
      const currentIndex = selected.indexOf(id);
      const newSelected = [...selected];

      if (currentIndex === -1) {
        newSelected.push(id);
      } else {
        newSelected.splice(currentIndex, 1);
      }

      setSelected(newSelected);
    };

    const handleNewFolderNameChange = (newName: string): void => {
      setCreateNewFolder({ ...createNewFolder, value: newName });
    };

    const handleNewFolderSave = async (): Promise<void> => {
      await createFolder();
      setIsFadingOut(false);
      setCreateNewFolder({ ...createNewFolder, open: false, value: '' });
      await fetchItems(
        breadcrumbData[breadcrumbData.length - 1].ServerRelativeUrl
      );
    };

    const handleNewFolderDismiss = (): void => {
      setIsFadingOut(true);
      setTimeout(() => {
        setCreateNewFolder({ open: false, value: '' });
        setIsFadingOut(false);
      }, 300);
    };

    useEffect(() => {
      if (library) {
        Promise.all([fetchPermissions(), fetchItems(library?.url as string)]);
      }
    }, [library]);

    const errorOrLoading = error ?? loading;
    const itemsHaveValue = items && items.length !== 0;
    const itemsDoNotHaveValue = !loading && items && items.length === 0;

    return (
      <Paper ref={ref} variant="outlined">
        <Stack flexDirection="column" spacing={2} padding={2}>
          <Toolbar
            displayType={displayType}
            permissions={permissions}
            selected={selected}
            message={message as IMessageState}
            onNewFolderCreate={handleNewFolderClick}
            onDisplayTypeChange={handleDisplayTypeChange}
            onDelete={handleItemsDelete}
            onSelectionCancel={handleSelectionCancel}
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
                <Typography color="error">{error}</Typography>
              </Box>
            ) : null}
            {!errorOrLoading && itemsHaveValue && displayType === 'grid' ? (
              <Grid
                container
                spacing={1}
                width="100%"
                sx={{ overflowY: 'auto' }}
              >
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
                      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
                    >
                      <Card ref={cardRef} variant="outlined">
                        <CardActions>
                          <Checkbox
                            size="small"
                            edge="end"
                            checked={selected.includes(
                              item?.ListItemAllFields?.Id
                            )}
                            onChange={() =>
                              handleItemSelection(item?.ListItemAllFields?.Id)
                            }
                          />
                        </CardActions>
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              width: '100%',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              textAlign: 'center',
                            }}
                          >
                            <Box>
                              {item.Type === 'folder' ? (
                                <Folder fontSize="large" color="primary" />
                              ) : null}
                              {item.Type === 'file' ? renderIcon() : null}
                            </Box>
                            <Link
                              noWrap
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '100%',
                              }}
                              underline="hover"
                              href="#"
                              {...props}
                            >
                              {item.Name}
                            </Link>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '100%',
                              }}
                            >
                              {dayjs(item.TimeLastModified).format('Do MMMM')}
                            </Typography>
                          </Box>
                        </CardContent>
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
                    <ListItem
                      key={item.UniqueId}
                      disablePadding
                      secondaryAction={
                        <Checkbox
                          size="small"
                          edge="end"
                          checked={selected.includes(
                            item?.ListItemAllFields?.Id
                          )}
                          onChange={() =>
                            handleItemSelection(item?.ListItemAllFields?.Id)
                          }
                        />
                      }
                    >
                      <ListItemButton {...props} disableRipple>
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
                    </ListItem>
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
