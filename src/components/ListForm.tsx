import * as React from 'react';
import * as dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Logger } from '@pnp/logging';
import { IListFormProps } from '../types';
import { ListService } from '../services';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import {
  Unstable_Grid2 as Grid,
  TextField,
  MenuItem,
  ButtonGroup,
  Button,
  Card,
  CardActions,
  CardContent,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PeoplePicker } from './PeoplePicker';
import { Close, Save } from '@mui/icons-material';

export const ListForm: React.FC<IListFormProps> = ({
  context,
  list,
  fields,
  onSave,
  onCancel,
  paperVariant,
  paperElevation,
  inputVariant,
  inputSize,
  fieldSpacing,
}) => {
  const listService = new ListService(context, list);
  const [filteredFields, setFilteredFields] = useState<IFieldInfo[]>([]);
  const [formData, setFormData] = useState<any>();

  useEffect(() => {
    listService
      .getListFields(fields)
      .then((response) => {
        setFilteredFields(response);
        console.log(response);
      })
      .catch((error) => {
        Logger.error(error);
      });
  }, [list, fields]);

  const handleSave = (): void => {
    if (onSave) {
      onSave(formData);
    } else {
      console.log(formData);
      // listService.createListItem(formData).then((response)=>{
      //   Logger.log(response);
      // }).catch((error)=>{
      //   Logger.error(error)
      // })
    }
  };

  const handleClose = (): void => {
    if (onCancel) {
      onCancel();
    } else {
      window.open(new URL(context.pageContext.site.absoluteUrl));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card
        variant={paperVariant}
        elevation={isNaN(Number(paperElevation)) ? 2 : paperElevation}
        sx={{ p: 2 }}
      >
        <CardContent>
          <Grid
            container
            spacing={isNaN(Number(fieldSpacing)) ? 2 : Number(fieldSpacing)}
          >
            {filteredFields.map((field, index) => {
              if (field.FieldTypeKind === FieldTypes.User) {
                return (
                  <Grid key={index} width="100%">
                    <PeoplePicker
                      context={context}
                      label={field.Title}
                      name={field.InternalName}
                      required={field.Required}
                      variant={inputVariant}
                      size={inputSize}
                      fullWidth
                      onSelectionChange={(value) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: value,
                        })
                      }
                    />
                  </Grid>
                );
              } else if (field.FieldTypeKind === FieldTypes.Choice) {
                return (
                  <Grid key={index} width="100%">
                    <TextField
                      label={field.Title}
                      name={field.InternalName}
                      required={field.Required}
                      variant={inputVariant}
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
              } else if (field.FieldTypeKind === FieldTypes.MultiChoice) {
                return (
                  <Grid key={index} width="100%">
                    <TextField
                      label={field.Title}
                      name={field.InternalName}
                      required={field.Required}
                      variant={inputVariant}
                      defaultValue={[]}
                      select
                      SelectProps={{ multiple: true }}
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
              } else if (field.FieldTypeKind === FieldTypes.DateTime) {
                return (
                  <Grid key={index} width="100%">
                    <DateTimePicker
                      label={field.Title}
                      name={field.InternalName}
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
                        },
                      }}
                    />
                  </Grid>
                );
              } else {
                return (
                  <Grid key={index} width="100%">
                    <TextField
                      label={field.Title}
                      name={field.InternalName}
                      variant={inputVariant}
                      fullWidth
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          [field.InternalName]: event.target.value,
                        })
                      }
                    />
                  </Grid>
                );
              }
            })}
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
