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
import * as strings from 'DashboardWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import DashboardDisplay from './DashboardDisplay';

export interface IDashboardWebPartProps {
  list: string;
  height: number;
  fields: string[];
}

export default class DashboardWebPart extends BaseClientSideWebPart<IDashboardWebPartProps> {
  public render(): void {
    const element = React.createElement(DashboardDisplay, {
      context: this.context,
      list: this.properties.list,
      fields: this.properties.fields,
      height: this.properties.height,
      editMode: 'row',
      editable: true,
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
                PropertyPaneTextField('height', {
                  label: strings.HeightFieldLabel,
                  description: strings.HeightFieldDescription,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
