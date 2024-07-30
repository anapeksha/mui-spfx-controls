import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneChoiceGroup,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IColumnReturnProperty,
  PropertyFieldColumnPicker,
  PropertyFieldColumnPickerOrderBy,
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
  PropertyFieldNumber,
} from '@pnp/spfx-property-controls';
import * as strings from 'ListItemPickerWebPartStrings';
import ListItemPicker from './ListItemPickerDisplay';
import { IListItemPickerProps } from '../../types';

export interface IListItemPickerWebPartProps {
  list: string;
  fields: string[];
  displayField: string;
  searchSuggestionLimit: number;
  label: string;
  disabled: boolean;
  size: 'small' | 'medium';
  variant: 'outlined' | 'filled' | 'standard';
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export default class ListItemPickerWebPart extends BaseClientSideWebPart<IListItemPickerWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IListItemPickerProps> =
      React.createElement(ListItemPicker, {
        context: this.context,
        list: this.properties.list,
        fields: this.properties.fields,
        displayField: this.properties.displayField,
        searchSuggestionLimit: this.properties.searchSuggestionLimit,
        label: this.properties.label,
        disabled: this.properties.disabled,
        size: this.properties.size,
        color: this.properties.color,
        variant: this.properties.variant,
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
                PropertyPaneTextField('displayField', {
                  label: strings.OptionDisplayFieldLabel,
                }),
                PropertyFieldNumber('searchSuggestionLimit', {
                  key: 'numberPickerFieldId',
                  label: strings.SearchSuggestionLimitFieldLabel,
                  value: this.properties.searchSuggestionLimit,
                }),
                PropertyPaneTextField('label', {
                  label: strings.LabelFieldLabel,
                }),
                PropertyPaneChoiceGroup('size', {
                  label: strings.SizeFieldLabel,
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
                PropertyPaneToggle('disabled', {
                  label: strings.DisabledFieldLabel,
                }),
                PropertyPaneDropdown('variant', {
                  label: strings.VariantFieldLabel,
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
                PropertyPaneDropdown('color', {
                  label: strings.ColorFieldLabel,
                  selectedKey: 'primary',
                  options: [
                    {
                      key: 'primary',
                      text: 'primary',
                    },
                    {
                      key: 'secondary',
                      text: 'secondary',
                    },
                    {
                      key: 'info',
                      text: 'info',
                    },
                    {
                      key: 'success',
                      text: 'success',
                    },
                    {
                      key: 'warning',
                      text: 'warning',
                    },
                    {
                      key: 'error',
                      text: 'error',
                    },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
