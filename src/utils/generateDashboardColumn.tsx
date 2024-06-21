import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GridColDef } from '@mui/x-data-grid';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import * as React from 'react';
import { PeoplePicker } from '../components';

export const generateDashboardColumn = (
  value: IFieldInfo,
  context: WebPartContext,
  editable?: boolean
): GridColDef => {
  if (value.FieldTypeKind === FieldTypes.User) {
    return {
      minWidth: 200,
      field: value.InternalName,
      headerName: value.Title,
      editable: value.ReadOnlyField ? false : editable,
      resizable: true,
      valueGetter: (params) => {
        return params.value ? params.value.Title : '';
      },
      renderEditCell: (params) => {
        return (
          <PeoplePicker
            context={context}
            label=""
            onSelectionChange={async (value) => {
              await params.api.setEditCellValue({
                ...params,
                value: {
                  Id: value[0].EntityData.SPUserID,
                  Title: value[0].DisplayText,
                  EMail: value[0].EntityData.Email,
                },
              });
            }}
            sx={{ border: 'none' }}
          />
        );
      },
    };
  } else if (value.FieldTypeKind === FieldTypes.Boolean) {
    return {
      minWidth: 100,
      field: value.InternalName,
      headerName: value.Title,
      editable: value.ReadOnlyField ? false : editable,
      resizable: true,
      type: 'boolean',
    };
  } else if (value.FieldTypeKind === FieldTypes.DateTime) {
    return {
      minWidth: 200,
      field: value.InternalName,
      headerName: value.Title,
      editable: value.ReadOnlyField ? false : editable,
      resizable: true,
      valueGetter: (params) => {
        return new Date(params.value);
      },
      type: 'dateTime',
    };
  } else if (
    value.FieldTypeKind === FieldTypes.Choice ||
    value.FieldTypeKind === FieldTypes.MultiChoice
  ) {
    return {
      minWidth: 200,
      field: value.InternalName,
      headerName: value.Title,
      editable: value.ReadOnlyField ? false : editable,
      type: 'singleSelect',
      resizable: true,
      valueOptions: value.Choices ? value.Choices : [],
    };
  } else if (
    value.FieldTypeKind === FieldTypes.Number ||
    value.FieldTypeKind === FieldTypes.Integer
  ) {
    return {
      minWidth: 200,
      field: value.InternalName,
      headerName: value.Title,
      editable: value.ReadOnlyField ? false : editable,
      type: 'number',
      resizable: true,
    };
  } else {
    return {
      minWidth: 200,
      field: value.InternalName,
      headerName: value.Title,
      editable: value.ReadOnlyField ? false : editable,
      resizable: true,
      type: 'string',
    };
  }
};
