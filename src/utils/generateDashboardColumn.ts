import { GridColDef } from '@mui/x-data-grid';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';

export const generateDashboardColumn = (
  currentField: IFieldInfo,
  editable: boolean
): GridColDef => {
  switch (currentField.FieldTypeKind) {
    case FieldTypes.User:
      return {
        flex: 1,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: editable,
        resizable: true,
        valueGetter: (params) => {
          return params.value ? params.value.Title : '';
        },
      };
    case FieldTypes.Boolean:
      return {
        flex: 0.5,
        field: currentField.InternalName,
        editable: editable,
        headerName: currentField.Title,
        resizable: true,
        type: 'boolean',
      };
    case FieldTypes.DateTime:
      return {
        flex: 1,
        field: currentField.InternalName,
        editable: editable,
        headerName: currentField.Title,
        resizable: true,
        valueGetter: (params) => {
          return new Date(params.value);
        },
        type: 'dateTime',
      };
    case FieldTypes.Choice:
    case FieldTypes.MultiChoice:
      return {
        flex: 2,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: editable,
        type: 'singleSelect',
        resizable: true,
        valueOptions: currentField.Choices ? currentField.Choices : [],
      };
    case FieldTypes.Number:
    case FieldTypes.Integer:
      return {
        flex: 2,
        field: currentField.InternalName,
        editable: editable,
        headerName: currentField.Title,
        type: 'number',
        resizable: true,
      };
    case FieldTypes.Note:
      return {
        flex: 4,
        field: currentField.InternalName,
        editable: editable,
        headerName: currentField.Title,
        type: 'string',
        resizable: true,
      };
    default:
      return {
        flex: 2,
        field: currentField.InternalName,
        editable: editable,
        headerName: currentField.Title,
        resizable: true,
        type: 'string',
      };
  }
};
