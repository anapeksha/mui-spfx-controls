interface IBaseNavigationModel {
  id: string;
  label: string;
}

interface INavigationModelWithoutChildren extends IBaseNavigationModel {
  children?: never;
  link?: string;
}

interface INavigationModelWithChildren extends IBaseNavigationModel {
  children: [INavigationModel, ...INavigationModel[]];
  link?: never;
}

type INavigationModel =
  | INavigationModelWithChildren
  | INavigationModelWithoutChildren;

export type { INavigationModel };
