interface INavigationModel {
  id: string;
  label: string;
  children?: INavigationModel[];
}

export type { INavigationModel };
