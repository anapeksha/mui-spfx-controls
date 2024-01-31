import { Version } from "@microsoft/sp-core-library";
import {
  PropertyPaneTextField,
  type IPropertyPaneConfiguration,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "PeoplePickerWebPartStrings";
import * as React from "react";
import * as ReactDom from "react-dom";
import { IPeoplePickerDisplayProps } from "./IPeoplePickerDisplayProps";
import PeoplePickerDisplay from "./PeoplePickerDisplay";

export interface IPeoplePickerWebPartProps {
  description: string;
}

export default class PeoplePickerWebPart extends BaseClientSideWebPart<IPeoplePickerWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IPeoplePickerDisplayProps> =
      React.createElement(PeoplePickerDisplay, {
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
    return Version.parse("1.0");
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
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
