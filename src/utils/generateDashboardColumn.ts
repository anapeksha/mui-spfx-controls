import { GridColDef } from '@mui/x-data-grid';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';

export const generateDashboardColumn = (
  currentField: IFieldInfo
): GridColDef => {
  if (currentField.FieldTypeKind === FieldTypes.User) {
    return {
      minWidth: 200,
      field: currentField.InternalName,
      headerName: currentField.Title,
      resizable: true,
      valueGetter: (params) => {
        return params.value ? params.value.Title : '';
      },
    };
  } else if (currentField.FieldTypeKind === FieldTypes.Boolean) {
    return {
      minWidth: 100,
      field: currentField.InternalName,
      headerName: currentField.Title,
      resizable: true,
      type: 'boolean',
    };
  } else if (currentField.FieldTypeKind === FieldTypes.DateTime) {
    return {
      minWidth: 200,
      field: currentField.InternalName,
      headerName: currentField.Title,
      resizable: true,
      valueGetter: (params) => {
        return new Date(params.value);
      },
      type: 'dateTime',
    };
  } else if (
    currentField.FieldTypeKind === FieldTypes.Choice ||
    currentField.FieldTypeKind === FieldTypes.MultiChoice
  ) {
    return {
      minWidth: 200,
      field: currentField.InternalName,
      headerName: currentField.Title,
      type: 'singleSelect',
      resizable: true,
      valueOptions: currentField.Choices ? currentField.Choices : [],
    };
  } else if (
    currentField.FieldTypeKind === FieldTypes.Number ||
    currentField.FieldTypeKind === FieldTypes.Integer
  ) {
    return {
      minWidth: 200,
      field: currentField.InternalName,
      headerName: currentField.Title,
      type: 'number',
      resizable: true,
    };
  } else {
    return {
      minWidth: 200,
      field: currentField.InternalName,
      headerName: currentField.Title,
      resizable: true,
      type: 'string',
    };
  }
};
