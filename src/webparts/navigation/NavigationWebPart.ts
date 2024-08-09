import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { PropertyFieldMonacoEditor } from '@pnp/spfx-property-controls';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SitePickerWebPartStrings';
import NavigationDisplay from './NavigationDisplay';
import { INavigationProps } from '../../types';

export interface ISitePickerWebPartProps {
  items: string;
}

export default class SitePickerWebPart extends BaseClientSideWebPart<ISitePickerWebPartProps> {
  public render(): void {
    const element: React.ReactElement<INavigationProps> = React.createElement(
      NavigationDisplay,
      {
        items: JSON.parse(this.properties.items),
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
                PropertyFieldMonacoEditor('items', {
                  key: 'items-editor',
                  language: 'json',
                  value: this.properties.items,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
