import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GridColDef } from '@mui/x-data-grid';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import React, { useEffect, useState } from 'react';
import { IPeoplePickerProps, PeoplePicker } from '../components';
import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';
import { PeopleSearchService } from '../services';

interface IWrapperPeoplePickerProps extends IPeoplePickerProps {
  query: string;
}

const WrapperPeoplePicker: React.FC<IWrapperPeoplePickerProps> = ({
  context,
  query,
  multiple,
  onChange,
  ...props
}) => {
  const peopleSearchService = new PeopleSearchService(context);
  const [resolvedUser, setResolvedUser] = useState<
    IPeoplePickerEntity | IPeoplePickerEntity[] | undefined
  >();
  useEffect(() => {
    peopleSearchService
      .resolveUser(context, query)
      .then((response) => setResolvedUser(response))
      .catch(() => {});
  }, []);
  return (
    <PeoplePicker
      context={context}
      value={resolvedUser}
      onChange={onChange}
      {...props}
    />
  );
};

export const generateDashboardColumn = (
  context: WebPartContext,
  currentField: IFieldInfo,
  editable: boolean
): GridColDef => {
  switch (currentField.FieldTypeKind) {
    case FieldTypes.User:
      return {
        flex: 1,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        valueFormatter: (params: any) => params.Title,
        resizable: true,
        renderEditCell: (params) => {
          return (
            <WrapperPeoplePicker
              context={context}
              query={params.value.EMail}
              onChange={(selectedUser: IPeoplePickerEntity) => {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: {
                    Id: selectedUser.EntityData.SPUserID,
                    EMail: selectedUser.EntityData.Email,
                    Title: selectedUser.DisplayText,
                  },
                });
              }}
            />
          );
        },
      };
    case FieldTypes.Boolean:
      return {
        flex: 0.5,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        type: 'boolean',
        resizable: true,
      };
    case FieldTypes.DateTime:
      return {
        flex: 1,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        valueGetter: (params) => {
          return new Date(params);
        },
        type: 'dateTime',
        resizable: true,
      };
    case FieldTypes.Choice:
    case FieldTypes.MultiChoice:
      return {
        flex: 2,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        type: 'singleSelect',
        resizable: true,
        valueOptions: currentField.Choices ? currentField.Choices : [],
      };
    case FieldTypes.Number:
    case FieldTypes.Integer:
      return {
        flex: 2,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        type: 'number',
        resizable: true,
      };
    case FieldTypes.Note:
      return {
        flex: 4,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        type: 'string',
        resizable: true,
      };
    default:
      return {
        flex: 2,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        type: 'string',
        resizable: true,
      };
  }
};
