declare interface ISearchBarWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  LabelFieldLabel: string;
  SizeFieldLabel: string;
  ColorFieldLabel: string;
  VariantFieldLabel: string;
  SearchScopeFieldLabel: string;
  ExcludedScopeFieldLabel: string;
}

declare module 'SearchBarWebPartStrings' {
  const strings: ISearchBarWebPartStrings;
  export = strings;
}
