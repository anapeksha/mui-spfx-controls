declare interface IListFormWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListFieldLabel: string;
  ColumnsFieldLabel: string;
  LabelFieldLabel: string;
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
