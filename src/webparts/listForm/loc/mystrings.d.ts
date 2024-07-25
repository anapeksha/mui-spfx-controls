declare interface IListFormWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListFieldLabel: string;
  ColumnsFieldLabel: string;
  PaperVariantFieldLabel: string;
  PaperElevationFieldLabel: string;
  InputVariantFieldLabel: string;
  InputSizeFieldLabel: string;
  FieldSpacingFieldLabel: string;
}

declare module 'ListFormWebPartStrings' {
  const strings: IListFormWebPartStrings;
  export = strings;
}
