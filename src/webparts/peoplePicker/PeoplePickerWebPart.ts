import { Version } from '@microsoft/sp-core-library';
import {
  PropertyPaneChoiceGroup,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PeoplePickerWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import PeoplePickerDisplay from './PeoplePickerDisplay';

export interface IPeoplePickerWebPartProps {
  label: string;
  size: 'small' | 'medium';
  disabled: boolean;
  variant: 'outlined' | 'filled' | 'standard';
  tagVariant: 'outlined' | 'filled';
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  tagColor: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export default class PeoplePickerWebPart extends BaseClientSideWebPart<IPeoplePickerWebPartProps> {
  public render(): void {
    const element: React.ReactElement = React.createElement(
      PeoplePickerDisplay,
      {
        context: this.context,
        label: this.properties.label,
        size: this.properties.size,
        disabled: this.properties.disabled,
        variant: this.properties.variant,
        tagVariant: this.properties.tagVariant,
        color: this.properties.color,
        tagColor: this.properties.tagColor,
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
                PropertyPaneDropdown('tagVariant', {
                  label: strings.TagVariantFieldLabel,
                  selectedKey: 'filled',
                  options: [
                    {
                      key: 'outlined',
                      text: 'outlined',
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
                PropertyPaneDropdown('tagColor', {
                  label: strings.TagColorFieldLabel,
                  selectedKey: 'default',
                  options: [
                    {
                      key: 'default',
                      text: 'default',
                    },
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
