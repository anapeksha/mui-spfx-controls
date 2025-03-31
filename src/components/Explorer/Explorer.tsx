import {
  Folder,
  Grid3x3,
  Home,
  InsertDriveFile,
  List as ListIcon,
} from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Grid2 as Grid,
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
import React, {
  FC,
  forwardRef,
  MouseEventHandler,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { DefaultExtensionType, defaultStyles, FileIcon } from 'react-file-icon';
import { LibraryService } from '../../services/LibraryService';
import { IExplorerProps } from './IExplorerProps';

type DisplayType = 'grid' | 'list';

interface IToolbarProps {
  displayType: DisplayType;
  onDisplayTypeChange: (displayType: DisplayType) => void;
}

interface IBreadcrumbData {
  Name: string;
  ServerRelativeUrl: string;
}

interface IViewProps {
  items: any[];
  onFolderClick: (item: IBreadcrumbData) => void;
  onFileClick: (item: IBreadcrumbData) => void;
}

interface IItemDefaultProps {
  onClick?: MouseEventHandler<HTMLElement>;
}

const Toolbar: FC<IToolbarProps> = ({ displayType, onDisplayTypeChange }) => {
  return (
    <Stack direction="row" spacing={1}>
      <ToggleButtonGroup
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

const GridView: FC<IViewProps> = ({ items, onFolderClick, onFileClick }) => {
  return (
    <Grid container spacing={1} width="100%">
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
            <SvgIcon color="primary">
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
                    {dayjs(item.TimeLastModified).format('DD MMMM')}
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

const ListView: FC<IViewProps> = ({ items, onFolderClick, onFileClick }) => {
  return (
    <List>
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
              secondary={dayjs(item.TimeLastModified).format('DD MMMM')}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

const Explorer: FC<IExplorerProps> = forwardRef(
  ({ context, library, height }, ref: RefObject<HTMLDivElement>) => {
    const [displayType, setDisplayType] = useState<DisplayType>('grid');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [breadcrumbData, setBreadcrumbData] = useState<IBreadcrumbData[]>([]);
    const [initial, setInitial] = useState(true);
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

    const handleDisplayTypeChange = (newValue: DisplayType): void => {
      setDisplayType(newValue);
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

    useEffect(() => {
      fetchItems(library.url as string);
    }, [library]);

    return (
      <Paper ref={ref} variant="outlined">
        <Stack flexDirection="column" spacing={2} padding={2}>
          <Toolbar
            displayType={displayType}
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
                <CircularProgress />
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
            {!loading &&
            !error &&
            displayType === 'grid' &&
            items &&
            items.length !== 0 ? (
              <GridView
                items={items}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
              />
            ) : null}
            {!loading &&
            !error &&
            displayType === 'list' &&
            items &&
            items.length !== 0 ? (
              <ListView
                items={items}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
              />
            ) : null}
            {!loading && !error && items && items.length === 0 ? (
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
