import * as React from 'react';
import {
  Box,
  Tooltip,
  Typography,
  Avatar,
  Chip,
  Checkbox,
} from '@mui/material';
import { IFieldInfo, FieldTypes } from '@pnp/sp/fields';
import { generateImageUrl } from './generateImageUrl';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GridColDef } from '@mui/x-data-grid';

export const generateDashboardColumn = (
  value: IFieldInfo,
  context: WebPartContext
): GridColDef => {
  if (value.FieldTypeKind === FieldTypes.User) {
    return {
      width: 250,
      field: value.InternalName,
      headerName: value.StaticName,
      renderCell: (params) => {
        return params.row[value.InternalName] &&
          params.row[value.InternalName].Title ? (
          <Tooltip
            title={
              <Box>
                <Typography variant="subtitle2">
                  Title: {params.row[value.InternalName].Title}
                </Typography>
                <Typography variant="subtitle2">
                  Email: {params.row[value.InternalName].EMail}
                </Typography>
                <Typography variant="caption">
                  User ID: {params.row[value.InternalName].Id}
                </Typography>
              </Box>
            }
            enterDelay={1000}
            enterNextDelay={1000}
          >
            <Chip
              avatar={
                <Avatar
                  src={generateImageUrl(
                    context,
                    params.row[value.InternalName].EMail
                  )}
                />
              }
              label={params.row[value.InternalName].Title}
            />
          </Tooltip>
        ) : (
          ''
        );
      },
    };
  } else if (value.FieldTypeKind === FieldTypes.Boolean) {
    return {
      flex: 1,
      field: value.InternalName,
      headerName: value.StaticName,
      renderCell: (params) => {
        return params.row[value.InternalName] &&
          params.row[value.InternalName] ? (
          <Checkbox checked={Boolean(params.row[value.InternalName])} />
        ) : (
          ''
        );
      },
    };
  } else {
    return {
      flex: 1,
      field: value.InternalName,
      headerName: value.StaticName,
    };
  }
};
