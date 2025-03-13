import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GridColDef } from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import React, { useEffect, useState } from 'react';
import { IPeoplePickerProps, PeoplePicker } from '../components/PeoplePicker';
import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';
import { PeopleSearchService } from '../services/PeopleSearchService';

interface IWrapperPeoplePickerProps extends IPeoplePickerProps {
  query: string;
  api: GridApiCommunity;
}

const WrapperPeoplePicker: React.FC<IWrapperPeoplePickerProps> = ({
  api,
  context,
  query,
  multiple,
  onChange,
  ...props
}) => {
  const peopleSearchService = new PeopleSearchService(context);
  const [resolvedUser, setResolvedUser] = useState<
    IPeoplePickerEntity | IPeoplePickerEntity[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    peopleSearchService
      .resolveUser(context, query)
      .then((response) => {
        setLoading(false);
        setResolvedUser(response);
      })
      .catch(() => {
        setLoading(false);
        setResolvedUser(null);
      });
  }, []);

  return (
    <PeoplePicker
      context={context}
      loading={loading}
      value={resolvedUser!}
      onChange={onChange}
      {...props}
    />
  );
};

export const generateDashboardColumn = (
  context: WebPartContext,
  currentField: IFieldInfo,
  editable: boolean,
  resizable: boolean
): GridColDef => {
  switch (currentField.FieldTypeKind) {
    case FieldTypes.User:
      return {
        flex: 1,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        valueFormatter: (params: any) => params.Title,
        resizable: resizable,
        renderEditCell: (params) => {
          return (
            <WrapperPeoplePicker
              api={params.api}
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
        resizable: resizable,
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
        resizable: resizable,
      };
    case FieldTypes.Choice:
    case FieldTypes.MultiChoice:
      return {
        flex: 2,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        type: 'singleSelect',
        resizable: resizable,
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
        resizable: resizable,
      };
    case FieldTypes.Note:
      return {
        flex: 4,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        type: 'string',
        resizable: resizable,
      };
    default:
      return {
        flex: 2,
        field: currentField.InternalName,
        headerName: currentField.Title,
        editable: !currentField.ReadOnlyField && editable,
        type: 'string',
        resizable: resizable,
      };
  }
};
