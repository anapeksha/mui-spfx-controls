import { Version } from '@microsoft/sp-core-library';
import {
  PropertyPaneDropdown,
  PropertyPaneTextField,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import {
  BaseClientSideWebPart,
  WebPartContext,
} from '@microsoft/sp-webpart-base';
import { GridProps, PaperProps, TextFieldProps } from '@mui/material';
import {
  IColumnReturnProperty,
  PropertyFieldColumnPicker,
  PropertyFieldColumnPickerOrderBy,
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from '@pnp/spfx-property-controls';
import * as strings from 'ListFormWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import ListFormDisplay from './ListFormDisplay';

export interface IListFormWebPartProps {
  context: WebPartContext;
  list: string;
  fields: string[];
  onSave: (formData: Record<string, any>) => void;
  onCancel: () => void;
  label?: string;
  paperVariant?: PaperProps['variant'];
  paperElevation?: PaperProps['elevation'];
  inputVariant?: TextFieldProps['variant'];
  inputSize?: TextFieldProps['size'];
  fieldSpacing?: GridProps['spacing'];
}

export default class ListFormWebPart extends BaseClientSideWebPart<IListFormWebPartProps> {
  private handleSave(formData: Record<string, any>): void {
    console.log(formData);
  }
  private handleCancel(): void {
    return;
  }
  public render(): void {
    const element: React.ReactElement = React.createElement(ListFormDisplay, {
      context: this.context,
      list: this.properties.list,
      fields: this.properties.fields,
      label: this.properties.label,
      paperVariant: this.properties.paperVariant,
      paperElevation: this.properties.paperElevation,
      inputVariant: this.properties.inputVariant,
      inputSize: this.properties.inputSize,
      fieldSpacing: this.properties.fieldSpacing,
      onSave: this.handleSave,
      onCancel: this.handleCancel,
    });
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('list', {
                  label: strings.ListFieldLabel,
                  selectedList: this.properties.list,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context as any,
                  key: 'listPickerFieldId',
                }),
                PropertyFieldColumnPicker('fields', {
                  label: strings.ColumnsFieldLabel,
                  context: this.context as any,
                  selectedColumn: this.properties.fields,
                  listId: this.properties.list,
                  disabled: false,
                  orderBy: PropertyFieldColumnPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  deferredValidationTime: 0,
                  key: 'columnPickerFieldId',
                  displayHiddenColumns: false,
                  columnReturnProperty: IColumnReturnProperty['Internal Name'],
                  multiSelect: true,
                }),
                PropertyPaneDropdown('paperVariant', {
                  label: strings.PaperVariantFieldLabel,
                  selectedKey: 'elevation',
                  options: [
                    {
                      key: 'outlined',
                      text: 'outlined',
                    },
                    {
                      key: 'elevation',
                      text: 'elevation',
                    },
                  ],
                }),
                PropertyPaneTextField('label', {
                  label: strings.LabelFieldLabel,
                }),
                PropertyPaneTextField('paperElevation', {
                  label: strings.PaperElevationFieldLabel,
                }),
                PropertyPaneDropdown('inputVariant', {
                  label: strings.InputVariantFieldLabel,
                  selectedKey: 'outlined',
                  options: [
                    {
                      key: 'outlined',
                      text: 'outlined',
                    },
                    {
                      key: 'standard',
                      text: 'standard',
                    },
                    {
                      key: 'filled',
                      text: 'filled',
                    },
                  ],
                }),
                PropertyPaneDropdown('inputSize', {
                  label: strings.InputSizeFieldLabel,
                  selectedKey: 'medium',
                  options: [
                    {
                      key: 'small',
                      text: 'small',
                    },
                    {
                      key: 'medium',
                      text: 'medium',
                    },
                  ],
                }),
                PropertyPaneTextField('fieldSpacing', {
                  label: strings.FieldSpacingFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
