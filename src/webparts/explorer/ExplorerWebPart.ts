import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyFieldList,
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from '@pnp/spfx-property-controls';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import * as strings from 'ExplorerWebPartStrings';
import { IExplorerProps } from '../../components/Explorer';
import ExplorerDisplay from './ExplorerDisplay';

export interface IExplorerWebPartProps {
  library: IPropertyFieldList;
}

export default class ExplorerWebPart extends BaseClientSideWebPart<IExplorerWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IExplorerProps> = React.createElement(
      ExplorerDisplay,
      {
        context: this.context,
        library: this.properties.library,
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
                PropertyFieldListPicker('library', {
                  label: 'Select a list',
                  selectedList: this.properties.library,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  baseTemplate: 101,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  listsToExclude: [
                    'Form Templates',
                    'Site Assets',
                    'Style Library',
                    'Content and Structure Reports',
                    'Site Pages',
                    'Images',
                    'Pages',
                    '_catalogs/hubsite',
                  ],
                  includeListTitleAndUrl: true,
                  properties: this.properties,
                  context: this.context,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
