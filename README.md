# SPFx Material-UI Component Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM publish](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/npm-publish.yml)

This is a SharePoint Framework (SPFx) component library built using Material-UI (MUI). It provides reusable React components for building modern and visually appealing user interfaces in SharePoint.

## Installation

To install this component library in your SPFx project, you can use npm:

```bash
npm install mui-spfx-controls --save
```

## Usage

Once installed, you can import and use the components in your SPFx web part or extension. Alternatively, prebuilt webparts can be used after deploying solution to site's AppCatalog For example:

```JSX
import * as React from 'react';
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PeoplePicker, IPeoplePickerProps } from 'mui-spfx-controls';

export default class PeoplePickerWebPart extends BaseClientWebPart {
  public render(): void {
    const element: React.ReactElement<IPeoplePickerProps> = React.createElement(
      PeoplePicker,
      {
        context: this.context,
        label: "People",
        size: "small",
        disabled: false,
        variant: "outlined",
        tagVariant: "filled",
        color: "primary",
        tagColor: "secondary",
      }
    );
    ReactDom.render(element, this.domElement);
  }
}
```

```JSX
import * as React from 'react';
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { Dashboard, IDashboardProps } from 'mui-spfx-controls';

export default class DashboardWebPart extends BaseClientWebPart {
  public render(): void {
    const element: React.ReactElement<IDashboardProps> = React.createElement(
      Dashboard,
      {
        context: this.context,
        list: "ListName",
        fields: ["Field1", "Field2", "Field3", "Field4"],
        height: 750,
      }
    );
    ReactDom.render(element, this.domElement);
  }
}
```

```JSX
import * as React from 'react';
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { ListForm, IListFormProps } from 'mui-spfx-controls';

export default class ListFormWebPart extends BaseClientWebPart {
  public render(): void {
    const element: React.ReactElement<IListFormProps> = React.createElement(
      ListForm,
      {
        context: this.context,
        list: "ListName",
        fields: ["Field1", "Field2", "Field3", "Field4"],
        paperVariant: "elevation",
        paperElevation: 2,
        inputVariant: "outlined",
        inputSize: "medium",
        fieldSpacing: 2,
      }
    );
    ReactDom.render(element, this.domElement);
  }
}
```

## Components

### PeoplePicker

A SharePoint people picker component with MUI library integration

#### Props

- context (required): SP context
- label (required): Textfield label
- onSelectionChange (optional): Get selection value updates
- searchSuggestionLimit (optional): number of suggestions to provide
- multiple (optional): single/multi select
- disabled (optional): Is component disabled
- variant (optional): Textfield variant ('standard', 'outlined', 'filled')
- tagVariant (optional): Chip variant ('filled', 'outlined')
- color (optional): Button color, e.g., "primary" or "secondary"
- tagColor (optional): Chip color, e.g., "default" or "secondary"
- size (optional): Size of component
- LoadingComponent (optional): A loading component
- styles (optional): Styles to apply
- sx (optional): MUI's sx prop

### Dashboard

A dashboard component with MUI Data Grid

#### Props

- context (required): SP context
- list (required): SharePoint list to pull data from
- fields (required): Internal Name of fields to display in dashboard
- height (optional): Absolute or relative container height
- sx (optional): MUI's sx prop

### List Form

A List Form component with MUI TextFields and Pickers to create form from lists

#### Props

- context (required): SP context
- list (required): SharePoint list to pull data from
- fields (required): Internal Name of fields to display in dashboard
- paperVariant (optional): Variant of the paper component ('outlined', 'elevation'),
- paperElevation: Elevation of the paper component,
- inputVariant: Textfield variant ('standard', 'outlined', 'filled'),
- inputSize (optional): Textfield size ('small', 'medium'),
- fieldSpacing (optional): Spacing between fields,

### List Item Picker

A List Item Picker component with MUI integration

#### Props

- context (required): SP context
- list (required): SharePoint list to pull data from
- fields (required): Internal Name of fields to include in the results
- displayField (required): Internal Name of the field to display in dropdown
- label (required): Textfield label
- onSelectionChange (optional): Get selection value updates
- multiple (optional): single/multi select
- searchSuggestionLimit (optional): number of suggestions to provide
- disabled (optional): Is component disabled
- variant (optional): Textfield variant ('standard', 'outlined', 'filled')
- size (optional): Size of component
- LoadingComponent (optional): A loading component
- color (optional): Button color, e.g., "primary" or "secondary"
- sx (optional): MUI's sx prop

## Development

If you want to contribute to the library, you can follow these steps:

Clone the repository:

```bash
git clone https://github.com/anapeksha/mui-spfx-controls.git
```

Install dependencies:

```bash
cd mui-spfx-controls
npm install
```

Serve the solution

```bash
npm run serve:fast
```

Test the components/webparts in a sample SPFx project

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
