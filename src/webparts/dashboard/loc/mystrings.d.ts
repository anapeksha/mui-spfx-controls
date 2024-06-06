declare interface IDashboardWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ListFieldLabel: string;
  ColumnsFieldLabel: string;
  HeightFieldLabel: string;
  HeightFieldDescription: string;
}

declare module 'DashboardWebPartStrings' {
  const strings: IDashboardWebPartStrings;
  export = strings;
}
