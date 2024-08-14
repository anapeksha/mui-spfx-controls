declare interface IDashboardWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListFieldLabel: string;
  ColumnsFieldLabel: string;
  ColumnActionFieldLabel: string;
  DensityActionFieldLabel: string;
  ExportActionFieldLabel: string;
  TabActionFieldLabel: string;
  TabValueFieldLabel: string;
  SearchActionFieldLabel: string;
  HeightFieldLabel: string;
  HeightFieldDescription: string;
}

declare module 'DashboardWebPartStrings' {
  const strings: IDashboardWebPartStrings;
  export = strings;
}
