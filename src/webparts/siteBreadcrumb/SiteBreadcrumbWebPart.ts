import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import {
  BaseClientSideWebPart,
  WebPartContext,
} from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import * as strings from 'SiteBreadcrumbWebPartStrings';
import SiteBreadcrumbDisplay from './SiteBreadcrumbDisplay';

export interface ISiteBreadcrumbWebPartProps {
  context: WebPartContext;
}

export default class SiteBreadcrumbWebPart extends BaseClientSideWebPart<ISiteBreadcrumbWebPartProps> {
  public render(): void {
    const element: React.ReactElement =
      React.createElement<ISiteBreadcrumbWebPartProps>(SiteBreadcrumbDisplay, {
        context: this.context,
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
          groups: [],
        },
      ],
    };
  }
}
