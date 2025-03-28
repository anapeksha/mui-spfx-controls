# SPFx Material-UI Component Library

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/anapeksha/mui-spfx-controls/blob/main/License)
[![Publish](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/publish.yml/badge.svg)](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/publish.yml)
[![Test](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/test.yml/badge.svg)](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/test.yml)
[![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=mui-spfx-controls&metric=alert_status)](https://sonarcloud.io/project?id=mui-spfx-controls)

This is a SharePoint Framework (SPFx) component library built using Material-UI (MUI). It provides reusable React components for building modern and visually appealing user interfaces in SharePoint.

## Deployment

A .sppkg solution package is available in [Releases](https://github.com/anapeksha/mui-spfx-controls/releases). You can upload this package to your SharePoint App Catalog for direct deployment.

This package includes built-in configurable web parts, making it easy to use without additional development.

## Installation

To install this component library in your SPFx project, you can use npm:

```bash
npm install mui-spfx-controls --save
```

## Usage

Once installed, you can import and use the components in your SPFx web part or extension. Alternatively, prebuilt webparts can be used after deploying solution to site's AppCatalog. For example:

### Code Editor

![Code Editor](https://github.com/anapeksha/mui-spfx-controls/blob/main/assets/code-editor.png?raw=true)

A code editor component powered by Monaco Editor with MUI integration.

#### Props

- renderControls (optional): Render controls for the editor

```jsx
import * as React from 'react';
import { CodeEditor } from 'mui-spfx-controls';

const CodeEditorWebPart = () => {
  return <CodeEditor renderControls={true} />;
};

export default CodeEditorWebPart;
```

---

### Site Breadcrumb

![Site Breadcrumb](https://github.com/anapeksha/mui-spfx-controls/blob/main/assets/site-breadcrumb.png?raw=true)

### Site Breadcrumb

A breadcrumb component for nested multi level deep SharePoint sites.

#### Props

- context (required): SP context

```jsx
import * as React from 'react';
import { SiteBreadcrumb } from 'mui-spfx-controls';

const SiteBreadcrumbWebPart = ({ context }) => {
  return <SiteBreadcrumb context={context} />;
};

export default SiteBreadcrumbWebPart;
```

---

### PeoplePicker

![People Picker](https://github.com/anapeksha/mui-spfx-controls/blob/main/assets/people-picker.png?raw=true)

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

```jsx
import * as React from 'react';
import { PeoplePicker } from 'mui-spfx-controls';

const PeoplePickerWebPart = ({ context }) => {
  return (
    <PeoplePicker
      context={context}
      label="People"
      size="small"
      disabled={false}
      variant="outlined"
      tagVariant="filled"
      color="primary"
      tagColor="secondary"
    />
  );
};

export default PeoplePickerWebPart;
```

---

### Dashboard

![Dashboard](https://github.com/anapeksha/mui-spfx-controls/blob/main/assets/dashboard.png?raw=true)

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

```jsx
import * as React from 'react';
import { Dashboard } from 'mui-spfx-controls';

const DashboardWebPart = ({ context }) => {
  return (
    <Dashboard
      context={context}
      list="ListName"
      fields={['Field1', 'Field2', 'Field3', 'Field4']}
      columnAction={false}
      exportAction={true}
      tabAction={true}
      densityAction={false}
      searchAction={true}
      editable={true}
      resizable={true}
      tabValue={[
        { fieldToMatch: 'Field1', stringToMatch: 'Test', label: 'Tab1' },
      ]}
      height={750}
    />
  );
};

export default DashboardWebPart;
```

---

### List Form

![List Form](https://github.com/anapeksha/mui-spfx-controls/blob/main/assets/list-form.png?raw=true)

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

```jsx
import * as React from 'react';
import { ListForm } from 'mui-spfx-controls';

const ListFormWebPart = ({ context }) => {
  return (
    <ListForm
      context={context}
      list="ListName"
      fields={['Field1', 'Field2', 'Field3', 'Field4']}
      paperVariant="elevation"
      paperElevation={2}
      inputVariant="outlined"
      inputSize="medium"
      fieldSpacing={2}
    />
  );
};

export default ListFormWebPart;
```

---

### List Item Picker

![List Item Picker](https://github.com/anapeksha/mui-spfx-controls/blob/main/assets/list-item-picker.png?raw=true)

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

```jsx
import * as React from 'react';
import { ListItemPicker } from 'mui-spfx-controls';

const ListItemPickerWebPart = ({ context }) => {
  return (
    <ListItemPicker
      context={context}
      list="ListName"
      fields={['Field1', 'Field2', 'Field3', 'Field4']}
      displayField="Title"
      label="List Items"
      searchSuggestionLimit={10}
      multiple={true}
      variant="outlined"
      size="medium"
    />
  );
};

export default ListItemPickerWebPart;
```

---

### Navigation

![Navigation](https://github.com/anapeksha/mui-spfx-controls/blob/main/assets/navigation.png?raw=true)

A Navigation component with MUI integration using MUI TreeView

#### Props

- context (required): SP context
- items (required): Array object to dynamically create the navigation tree
- itemProps (optional): Props for Tree Item
- viewProps (optional): Props for Tree View
- sx (optional): MUI's sx prop

```jsx
import * as React from 'react';
import { Navigation } from 'mui-spfx-controls';

const NavigationWebPart = () => {
  return (
    <Navigation
      items={[
        {
          id: 'iron_man',
          label: 'Iron Man',
          children: [
            {
              id: 'iron_man_1',
              label: 'Iron Man (2008)',
              link: 'https://www.imdb.com/title/tt0371746/',
            },
          ],
        },
      ]}
    />
  );
};

export default NavigationWebPart;
```

---

### Searchbar

![Searchbar](https://github.com/anapeksha/mui-spfx-controls/blob/main/assets/searchbar.png?raw=true)

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

```jsx
import * as React from 'react';
import { SearchBar } from 'mui-spfx-controls';

const SearchBarWebPart = ({ context }) => {
  return (
    <SearchBar
      context={context}
      label="Search"
      size="small"
      scope="https://acme.sharepoint.com/sites/include"
      excludedScope="https://acme.sharepoint.com/sites/exclude"
    />
  );
};

export default SearchBarWebPart;
```

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

This project is licensed under the MIT License - see [LICENSE](https://github.com/anapeksha/mui-spfx-controls/blob/main/License) file for details.
