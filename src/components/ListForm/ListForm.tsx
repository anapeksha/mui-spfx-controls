import { Close, Save } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Logger } from '@pnp/logging';
import { IFieldInfo } from '@pnp/sp/fields';
import dayjs from 'dayjs';
import * as React from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { ListService } from '../../services/ListService';
import { PeoplePicker } from '../PeoplePicker/PeoplePicker';
import { IListFormProps } from './IListFormProps';

export const ListForm: React.ForwardRefExoticComponent<IListFormProps> =
  forwardRef(
    (
      {
        context,
        list,
        fields,
        label,
        paperVariant,
        paperElevation,
        inputVariant,
        inputSize,
        fieldSpacing,
        responsive,
        onSave,
        onCancel,
      },
      ref: React.RefObject<HTMLDivElement>
    ) => {
      const listService = new ListService(context, list);
      const [filteredFields, setFilteredFields] = useState<IFieldInfo[]>([]);
      const [formData, setFormData] = useState<Record<string, any>>({});
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        if (list) {
          const fetchFields = async (): Promise<void> => {
            try {
              setLoading(true);
              const response = await listService.getListFields(fields);
              setFilteredFields(response);
            } catch (error) {
              Logger.error(error);
            } finally {
              setLoading(false);
            }
          };

          fetchFields();
        }
      }, [list, fields]);

      const handleFieldTypes = (): React.ReactNode => {
        if (loading) {
          if (list === '' || list === undefined || list === null) {
            return (
              <Grid display="flex" width="100%" justifyContent="center" p={1}>
                <Typography
                  color="primary"
                  variant="h5"
                  fontWeight="bold"
                  component="span"
                >
                  Select a list to continue
                </Typography>
              </Grid>
            );
          } else {
            return (
              <Grid display="flex" width="100%" justifyContent="center">
                <CircularProgress />
              </Grid>
            );
          }
        } else {
          return filteredFields.map((field, index) => {
            const commonProps = {
              key: `grid-${field.Id}-${index}`,
              size: responsive
                ? responsive[field.TypeAsString].size
                : { xs: 12 },
            };
            switch (field.TypeAsString) {
              case 'Text':
                return (
                  <Grid {...commonProps}>
                    <TextField
                      label={field.Title}
                      name={field.InternalName}
                      required={field.Required}
                      variant={inputVariant}
                      size={inputSize}
                      fullWidth
                      disabled={field.ReadOnlyField}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: event.target.value,
                        })
                      }
                    />
                  </Grid>
                );
              case 'User':
                return (
                  <Grid {...commonProps}>
                    <PeoplePicker
                      context={context}
                      label={field.Title}
                      name={field.InternalName}
                      required={field.Required}
                      multiple={false}
                      variant={inputVariant}
                      size={inputSize}
                      fullWidth
                      disabled={field.ReadOnlyField}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: value,
                        })
                      }
                    />
                  </Grid>
                );
              case 'UserMulti':
                return (
                  <Grid {...commonProps}>
                    <PeoplePicker
                      context={context}
                      label={field.Title}
                      name={field.InternalName}
                      required={field.Required}
                      multiple={true}
                      variant={inputVariant}
                      size={inputSize}
                      fullWidth
                      disabled={field.ReadOnlyField}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: value,
                        })
                      }
                    />
                  </Grid>
                );
              case 'Choice':
                return (
                  <Grid {...commonProps}>
                    <TextField
                      label={field.Title}
                      name={field.InternalName}
                      required={field.Required}
                      variant={inputVariant}
                      size={inputSize}
                      disabled={field.ReadOnlyField}
                      select
                      fullWidth
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: event.target.value,
                        })
                      }
                    >
                      {field.Choices?.map((choice, index) => (
                        <MenuItem key={`${choice}-${index}`} value={choice}>
                          {choice}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                );
              case 'MultiChoice':
                return (
                  <Grid {...commonProps}>
                    <TextField
                      label={field.Title}
                      name={field.InternalName}
                      required={field.Required}
                      variant={inputVariant}
                      size={inputSize}
                      defaultValue={[]}
                      select
                      fullWidth
                      disabled={field.ReadOnlyField}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: event.target.value,
                        })
                      }
                      slotProps={{
                        select: {
                          multiple: true,
                        },
                        input: {
                          readOnly: field.ReadOnlyField,
                        },
                      }}
                    >
                      {field.Choices?.map((choice, index) => (
                        <MenuItem key={`${choice}-${index}`} value={choice}>
                          {choice}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                );
              case 'DateTime':
                return (
                  <Grid {...commonProps}>
                    <DateTimePicker
                      label={field.Title}
                      name={field.InternalName}
                      disabled={field.ReadOnlyField}
                      onChange={(value: dayjs.Dayjs) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: dayjs(value).toISOString(),
                        })
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: inputVariant,
                          required: field.Required,
                          size: inputSize,
                        },
                      }}
                    />
                  </Grid>
                );
              case 'Boolean':
                return (
                  <Grid {...commonProps}>
                    <FormControlLabel
                      required={field.Required}
                      name={field.InternalName}
                      disabled={field.ReadOnlyField}
                      onChange={(event, checked) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: checked,
                        })
                      }
                      control={<Checkbox size={inputSize} />}
                      label={field.Title}
                    />
                  </Grid>
                );
              case 'Lookup':
                return (
                  <Grid {...commonProps}>
                    <p>{(field as any).LookupList}</p>
                  </Grid>
                );
              case 'Counter':
                return (
                  <Grid {...commonProps}>
                    <Card
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'common.white',
                      }}
                    >
                      <CardHeader
                        title={`Counter Type, Title - ${field.Title}`}
                        slotProps={{ typography: { variant: 'h6' } }}
                      />
                    </Card>
                  </Grid>
                );
              default:
                return (
                  <Grid {...commonProps}>
                    <Card
                      sx={{
                        backgroundColor: 'error.main',
                        color: 'common.white',
                      }}
                    >
                      <CardHeader title="Yet to be implemented!" />
                    </Card>
                  </Grid>
                );
            }
          });
        }
      };

      const handleSave = (): void => {
        if (onSave) {
          onSave(formData);
        }
      };

      const handleClose = (): void => {
        if (onCancel) {
          onCancel();
        }
      };

      const calculatedPaperElevation = isNaN(Number(paperElevation))
        ? 2
        : paperElevation;

      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Card
            ref={ref}
            data-testid="mui-spfx-listform"
            variant={paperVariant ?? 'outlined'}
            elevation={
              paperVariant === 'elevation' ? calculatedPaperElevation : 0
            }
            sx={{ p: 2 }}
          >
            {label ? <CardHeader title={label} /> : null}
            <CardContent>
              <Grid
                container
                spacing={isNaN(Number(fieldSpacing)) ? 2 : Number(fieldSpacing)}
              >
                {handleFieldTypes()}
              </Grid>
            </CardContent>
            <CardActions>
              <ButtonGroup>
                <Button
                  startIcon={<Save />}
                  color="success"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  startIcon={<Close />}
                  type="reset"
                  color="error"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </CardActions>
          </Card>
        </LocalizationProvider>
      );
    }
  );

export default ListForm;
