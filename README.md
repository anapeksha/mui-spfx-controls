# SPFx Material-UI Component Library

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/anapeksha/mui-spfx-controls/blob/main/License)
[![Publish](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/publish.yml/badge.svg)](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/publish.yml)
[![Test](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/test.yml/badge.svg)](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/test.yml)

This is a SharePoint Framework (SPFx) component library built using Material-UI (MUI). It provides reusable React components for building modern and visually appealing user interfaces in SharePoint.

## Deployment

A .sppkg solution package is available in the [Releases](https://github.com/anapeksha/mui-spfx-controls/releases). You can upload this package to your SharePoint App Catalog for direct deployment.

This package includes built-in configurable web parts, making it easy to use without additional development.

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
        columnAction: false,
        exportAction: true,
        tabAction: true,
        densityAction: false,
        searchAction: true,
        editable: true,
        resizable: true,
        tabValue: [{fieldToMatch: "Field1", stringToMatch: "Test", label: "Tab1"}],
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

```JSX
import * as React from 'react';
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { ListItemPicker, IListItemPickerProps } from 'mui-spfx-controls';

export default class ListFormWebPart extends BaseClientWebPart {
  public render(): void {
    const element: React.ReactElement<IListFormProps> = React.createElement(
      ListItemPicker,
      {
        context: this.context,
        list: "ListName",
        fields: ["Field1", "Field2", "Field3", "Field4"],
        displayField: "Title",
        label: "List Items",
        searchSuggestionLimit: 10,
        multiple: true,
        variant: "outlined",
        size: "medium",
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
import { Navigation, INavigationProps } from 'mui-spfx-controls';

export default class NavigationWebPart extends BaseClientWebPart {
  public render(): void {
    const element: React.ReactElement<INavigationProps> = React.createElement(
      Navigation,
      {
        items: [{id: 'iron_man', label: 'Iron Man', children: [{ id: 'iron_man_1', label: 'Iron Man (2008)', link: 'https://www.imdb.com/title/tt0371746/' }]}],
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
import { SearchBar, ISearchBarProps } from 'mui-spfx-controls';

export default class SearchBarWebPart extends BaseClientWebPart {
  public render(): void {
    const element: React.ReactElement<ISearchBarProps> = React.createElement(
      SearchBar,
      {
        context: this.context,
        label: "Search",
        size: "small",
        scope: "https://acme.sharepoint.com/sites/include",
        excludedScope: "https://acme.sharepoint.com/sites/exclude",
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
- renderInput (optional): Render a custom input component
- sx (optional): MUI's sx prop

### Dashboard

A dashboard component with MUI Data Grid

#### Props

- context (required): SP context
- list (required): SharePoint list to pull data from
- fields (required): Internal Name of fields to display in dashboard
- columnAction (optional): Enable/Disable column on/off feature
- densityAction (optional): Enable/Disable column density
- filterAction (optional): Enable/Disable filtering
- exportAction (optional): Enable/Disable export functionality
- searchAction (optional): Enable/Disable search functionality
- tabAction (optional): Enable/Disable tab feature
- tabValue (required if tabAction is true): Array object for Tabs
- editable (optional): Enable/Disable editing feature
- resizable (optional): Enable/Disable column resizing
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

### Navigation

A Navigation component with MUI integration using MUI TreeView

#### Props

- context (required): SP context
- items (required): Array object to dynamically create the navigation tree
- itemProps (optional): Props for Tree Item
- viewProps (optional): Props for Tree View
- sx (optional): MUI's sx prop

### SearchBar

A search bar component with MUI library integration

#### Props

- context (required): SP context
- label (optional): Textfield label
- onSearchResultSelect (optional): Get selection value updates
- variant (optional): Textfield variant ('standard', 'outlined', 'filled')
- size (optional): Size of component
- color (optional): Button color, e.g., "primary" or "secondary"
- scope (optional): Search scope (URL)
- excludedScope (optional): Search scope to exclude (URL)
- sx (optional): MUI's sx prop

## Development

Run the solution in development mode:

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

Test the components/webparts in the workbench

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/anapeksha/mui-spfx-controls/blob/main/License) file for details.
