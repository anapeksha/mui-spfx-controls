import { WebPartContext } from "@microsoft/sp-webpart-base";
import { AutocompleteProps, TextFieldVariants } from "@mui/material";
import { CSSProperties, ReactNode } from "react";
import { IExtendedPeoplePickerEntity } from "./IExtendedPeoplePicker";

type AutocompleteBaseProps = AutocompleteProps<
  IExtendedPeoplePickerEntity,
  boolean,
  boolean,
  true
>;

interface IPeoplePickerProps {
  context: WebPartContext;
  label: string;
  onSelectionChange?: (value: IExtendedPeoplePickerEntity[]) => void;
  searchSuggestionLimit?: number;
  personSelectionLimit?: number;
  disabled?: boolean;
  variant?: TextFieldVariants;
  color?: "error" | "primary" | "secondary" | "info" | "success" | "warning";
  size?: "small" | "medium";
  styles?: CSSProperties;
  sx?: AutocompleteBaseProps["sx"];
  LoadingComponent?: ReactNode;
}

export type { IPeoplePickerProps };
