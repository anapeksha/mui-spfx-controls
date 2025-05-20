import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneChoiceGroup,
  PropertyPaneDropdown,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { TextFieldProps, TextFieldVariants } from '@mui/material';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as strings from 'SearchBarWebPartStrings';
import SearchbarDisplay from './SearchbarDisplay';

export interface ISearchbarWebPartProps {
  label: string;
  size: TextFieldProps['size'];
  color: TextFieldProps['color'];
  variant: TextFieldVariants;
  scope: string;
  excludedScope: string;
}

export default class SearchbarWebPart extends BaseClientSideWebPart<ISearchbarWebPartProps> {
  public render(): void {
    const element: React.ReactElement = React.createElement(SearchbarDisplay, {
      context: this.context,
      label: this.properties.label,
      variant: this.properties.variant,
      size: this.properties.size,
      scope: this.properties.scope,
      color: this.properties.color,
      excludedScope: this.properties.excludedScope,
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
                PropertyPaneTextField('scope', {
                  label: strings.SearchScopeFieldLabel,
                }),
                PropertyPaneTextField('excludedScope', {
                  label: strings.ExcludedScopeFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
