import { Version } from '@microsoft/sp-core-library';
import {
  PropertyPaneTextField,
  PropertyPaneToggle,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { Logger } from '@pnp/logging';
import {
  Elanguages,
  IColumnReturnProperty,
  PropertyFieldColumnPicker,
  PropertyFieldColumnPickerOrderBy,
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
  PropertyFieldMonacoEditor,
} from '@pnp/spfx-property-controls';
import * as strings from 'DashboardWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ITabSchema } from '../../components/Dashboard/IDashboardProps';
import DashboardDisplay from './DashboardDisplay';

export interface IDashboardWebPartProps {
  list: string;
  fields: string[];
  height: number;
  exportAction: boolean;
  tabAction: true;
  searchAction: boolean;
  densityAction: boolean;
  columnAction: boolean;
  tabValue: string;
}

export default class DashboardWebPart extends BaseClientSideWebPart<IDashboardWebPartProps> {
  public render(): void {
    let parsedTabValue: ITabSchema[] = [];
    try {
      parsedTabValue = JSON.parse(this.properties.tabValue);
    } catch (error) {
      Logger.error(error as Error);
    }
    const element = React.createElement(DashboardDisplay, {
      context: this.context,
      list: this.properties.list,
      fields: this.properties.fields,
      columnAction: this.properties.columnAction,
      exportAction: this.properties.exportAction,
      tabAction: this.properties.tabAction,
      densityAction: this.properties.densityAction,
      searchAction: this.properties.searchAction,
      height: this.properties.height,
      tabValue: parsedTabValue,
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
                PropertyPaneToggle('searchAction', {
                  label: strings.SearchActionFieldLabel,
                }),
                PropertyPaneToggle('tabAction', {
                  label: strings.TabActionFieldLabel,
                }),
                PropertyPaneToggle('exportAction', {
                  label: strings.ExportActionFieldLabel,
                }),
                PropertyPaneToggle('columnAction', {
                  label: strings.ColumnActionFieldLabel,
                }),
                PropertyPaneToggle('densityAction', {
                  label: strings.DensityActionFieldLabel,
                }),
                PropertyFieldMonacoEditor('tabValue', {
                  key: 'tabValue-editor',
                  language: Elanguages.json,
                  value: this.properties.tabValue,
                  showLineNumbers: true,
                  showMiniMap: true,
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
