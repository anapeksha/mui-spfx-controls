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

Once installed, you can import and use the components in your SPFx web part or extension. For example:

```JSX
import * as React from 'react';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { ThemeProvider } from '@mui/material';
import { spfi, SPFx } from "@pnp/sp";
import { PeoplePicker } from 'mui-spfx-controls';
import { theme } from '/path/to/theme';


export default class MyWebPart extends BaseClientWebPart {
  public render(): React.ReactElement<any> {
    const sp = spfi().using(SPFx(this.context));
    return (
      <ThemeProvider theme={theme}>
        <PeoplePicker sp={sp} label="Search" color="primary" variant="outlined">
      </ThemeProvider>
    );
  }
}
```

## Components

### PeoplePicker

A SharePoint people picker component with MUI library integration

#### Props

- sp (required): SPFI object
- label (required): Textfield label
- variant (optional): Textfield variant ('standard', 'outlined', 'filled')
- color (optional): Button color, e.g., "primary" or "secondary"
- maxUsers (optional): Maximum user input
- LoadingComponent (optional): A loading component

#### Hooks

```JSX
useUser(sp: SPFI, email: string) => {}
```

## Development

If you want to contribute or modify the library, you can follow these steps:

Clone the repository:

```bash
git clone https://github.com/anapeksha/mui-spfx-controls.git
```

Install dependencies:

```bash
cd mui-spfx-controls
npm install
```

Build the library:

```bash
npm run build
```

Test the components in a sample SPFx project

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
