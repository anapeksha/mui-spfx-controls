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
  Unstable_Grid2 as Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Logger } from '@pnp/logging';
import { IFieldInfo } from '@pnp/sp/fields';
import * as dayjs from 'dayjs';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ListService } from '../../services';
import { PeoplePicker } from '../PeoplePicker/PeoplePicker';
import { IListFormProps } from './IListFormProps';

export const ListForm: React.FC<IListFormProps> = ({
  context,
  list,
  fields,
  onSave,
  onCancel,
  label,
  paperVariant,
  paperElevation,
  inputVariant,
  inputSize,
  fieldSpacing,
}) => {
  const listService = new ListService(context, list);
  const [filteredFields, setFilteredFields] = useState<IFieldInfo[]>([]);
  const [formData, setFormData] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listService
      .getListFields(fields)
      .then((response) => {
        setFilteredFields(response);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(error);
      });
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
        switch (field.TypeAsString) {
          case 'Text':
            return (
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
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
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
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
                  onSelectionChange={(value) =>
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
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
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
                  onSelectionChange={(value) =>
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
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
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
                    <MenuItem key={index} value={choice}>
                      {choice}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            );
          case 'MultiChoice':
            return (
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
                <TextField
                  label={field.Title}
                  name={field.InternalName}
                  required={field.Required}
                  variant={inputVariant}
                  size={inputSize}
                  defaultValue={[]}
                  select
                  SelectProps={{ multiple: true }}
                  fullWidth
                  disabled={field.ReadOnlyField}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      [field.InternalName]: event.target.value,
                    })
                  }
                  InputProps={{
                    readOnly: field.ReadOnlyField,
                  }}
                >
                  {field.Choices?.map((choice, index) => (
                    <MenuItem key={index} value={choice}>
                      {choice}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            );
          case 'DateTime':
            return (
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
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
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
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
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
                <p>{(field as any).LookupList}</p>
              </Grid>
            );
          case 'Counter':
            return (
              <Grid key={`grid-${field.Id}-${index}`} width="100%">
                <Card
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'common.white',
                  }}
                >
                  <CardHeader
                    title={`Counter Type, Title - ${field.Title}`}
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                </Card>
              </Grid>
            );
          default:
            return (
              <Grid
                key={`grid-not-implemented-${field.Id}-${index}`}
                width="100%"
              >
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        variant={paperVariant}
        elevation={isNaN(Number(paperElevation)) ? 2 : paperElevation}
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
            <Button startIcon={<Save />} color="success" onClick={handleSave}>
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
};

export default ListForm;
