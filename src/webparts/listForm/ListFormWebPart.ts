import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  PropertyPaneTextField,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IColumnReturnProperty,
  PropertyFieldColumnPicker,
  PropertyFieldColumnPickerOrderBy,
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from '@pnp/spfx-property-controls';
import { PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import * as strings from 'ListFormWebPartStrings';
import ListFormDisplay from './ListFormDisplay';
import { IListFormProps } from '../../types';

export interface IListFormWebPartProps extends IListFormProps {}

export default class ListFormWebPart extends BaseClientSideWebPart<IListFormWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IListFormProps> = React.createElement(
      ListFormDisplay,
      {
        context: this.context,
        list: this.properties.list,
        fields: this.properties.fields,
        paperVariant: this.properties.paperVariant,
        paperElevation: this.properties.paperElevation,
        inputVariant: this.properties.inputVariant,
        inputSize: this.properties.inputSize,
        fieldSpacing: this.properties.fieldSpacing,
      }
    );
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
