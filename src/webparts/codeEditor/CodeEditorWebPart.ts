import { Version } from '@microsoft/sp-core-library';
import {
  PropertyPaneToggle,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import * as strings from 'CodeEditorWebPartStrings';
import { ICodeEditorProps } from '../../components/CodeEditor';
import CodeEditorDisplay from './CodeEditorDisplay';

export interface ICodeEditorWebPartProps {
  renderControls: boolean;
}

export default class CodeEditorWebPart extends BaseClientSideWebPart<ICodeEditorWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ICodeEditorProps> = React.createElement(
      CodeEditorDisplay,
      {
        renderControls: this.properties.renderControls,
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
                PropertyPaneToggle('renderControls', {
                  checked: this.properties.renderControls,
                  label: strings.RenderInputFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
