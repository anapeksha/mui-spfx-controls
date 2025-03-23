import { Version } from '@microsoft/sp-core-library';
import {
  PropertyPaneTextField,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import * as strings from 'SiteBreadcrumbWebPartStrings';
import SiteBreadcrumbDisplay from './SiteBreadcrumbDisplay';

export interface ISiteBreadcrumbWebPartProps {
  separator: React.ReactNode;
}

export default class SiteBreadcrumbWebPart extends BaseClientSideWebPart<ISiteBreadcrumbWebPartProps> {
  public render(): void {
    const element: React.ReactElement = React.createElement(
      SiteBreadcrumbDisplay,
      {
        context: this.context,
        separator: this.properties.separator,
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
                PropertyPaneTextField('separator', {
                  label: strings.SeparatorFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
