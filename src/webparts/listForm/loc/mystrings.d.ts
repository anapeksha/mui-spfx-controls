declare interface IListFormWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListFieldLabel: string;
  ColumnsFieldLabel: string;
}

declare module 'ListFormWebPartStrings' {
  const strings: IListFormWebPartStrings;
  export = strings;
}
