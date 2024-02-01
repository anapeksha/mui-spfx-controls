# SPFx Material-UI Component Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Build](https://github.com/anapeksha/mui-spfx-controls/actions/workflows/npm-publish.yml/badge.svg?branch=main)

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
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { ThemeProvider } from '@mui/material';
import { spfi, SPFx, SPFI } from "@pnp/sp";
import { PeoplePicker } from 'mui-spfx-controls';
import { theme } from '/path/to/theme';

export default class PeoplePickerWebPart extends BaseClientWebPart {
  public render(): React.ReactElement<any> {
    return (
      <ThemeProvider theme={theme}>
        <PeoplePicker context={this.context} label="Search" color="primary" variant="outlined">
      </ThemeProvider>
    );
  }
}
```

## Components

### PeoplePicker

A SharePoint people picker component with MUI library integration

#### Props

- context (required): SP
- label (required): Textfield label
- onSelectionChange (optional): Get selection value updates
- searchSuggestionLimit (optional): number of suggestions to provide
- variant (optional): Textfield variant ('standard', 'outlined', 'filled')
- color (optional): Button color, e.g., "primary" or "secondary"
- disabled (optional): Is component disabled
- size (optional): Size of component
- LoadingComponent (optional): A loading component
- styles (optional): Styles to apply
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
npm run dev
```

Test the components/webparts in a sample SPFx project

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
