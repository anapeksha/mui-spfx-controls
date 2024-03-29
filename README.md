# SPFx Material-UI Component Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
    const element = React.ReactElement<IPeoplePickerProps> = React.createElement(
      PeoplePickerDisplay,
      {
        context: this.context,
        label: this.properties.label,
        size: this.properties.size,
        disabled: this.properties.disabled,
        variant: this.properties.variant,
        tagVariant: this.properties.tagVariant,
        color: this.properties.color,
        tagColor: this.properties.color
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

- context (required): SP
- label (required): Textfield label
- onSelectionChange (optional): Get selection value updates
- searchSuggestionLimit (optional): number of suggestions to provide
- disabled (optional): Is component disabled
- variant (optional): Textfield variant ('standard', 'outlined', 'filled')
- tagVariant (optional): Chip variant ('filled', 'outlined')
- color (optional): Button color, e.g., "primary" or "secondary"
- tagColor (optional): Chip color, e.g., "default" or "secondary"
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

Install gulp cli:

```bash
npm install -g gulp-cli
```

Serve the solution

```bash
gulp serve
```

Test the components/webparts in a sample SPFx project

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
