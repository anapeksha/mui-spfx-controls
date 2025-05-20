import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GridColDef } from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { FieldTypes, IFieldInfo } from '@pnp/sp/fields';
import React, { useEffect, useState } from 'react';
import { IPeoplePickerProps, PeoplePicker } from '../components/PeoplePicker';
import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';
import { PeopleService } from '../services/PeopleService';

/**
 * Extended properties for PeoplePicker used within the data grid.
 */
interface IWrapperPeoplePickerProps extends IPeoplePickerProps {
  /** Query string to resolve user details */
  query: string;
  /** Grid API instance for handling cell updates */
  api: GridApiCommunity;
}

/**
 * Wrapper component for PeoplePicker, resolving user details based on query.
 */
const WrapperPeoplePicker: React.FC<IWrapperPeoplePickerProps> = ({
  api,
  context,
  query,
  multiple,
  onChange,
  ...props
}) => {
  const peopleService = new PeopleService(context);
  const [resolvedUser, setResolvedUser] = useState<
    IPeoplePickerEntity | IPeoplePickerEntity[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveUser = async (): Promise<void> => {
      try {
        const resolvedUserResponse = await peopleService.resolveUser(
          context,
          query
        );
        setResolvedUser(resolvedUserResponse);
      } catch {
        setResolvedUser(null);
      } finally {
        setLoading(false);
      }
    };

    resolveUser();
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

/**
 * Generates a dashboard column configuration for use in MUI DataGrid.
 *
 * @param {WebPartContext} context - SharePoint WebPart context.
 * @param {IFieldInfo} currentField - SharePoint field information.
 * @param {boolean | undefined} editable - Whether the column is editable.
 * @param {boolean | undefined} resizable - Whether the column is resizable.
 * @returns {GridColDef} - Column definition for MUI DataGrid.
 */
export const generateDashboardColumn = (
  context: WebPartContext,
  currentField: IFieldInfo,
  editable?: boolean,
  resizable?: boolean
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
