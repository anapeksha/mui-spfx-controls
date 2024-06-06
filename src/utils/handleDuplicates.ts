import { IExtendedPeoplePickerEntity } from '../types';

const listContainsPeople = (
  user: IExtendedPeoplePickerEntity,
  users: IExtendedPeoplePickerEntity[]
): IExtendedPeoplePickerEntity[] | boolean => {
  if (!users || !users.length || users.length === 0) {
    return false;
  } else {
    return users.some((value) => value.Key === user.Key);
  }
};

const handleDuplicates = (
  searchResults: IExtendedPeoplePickerEntity[],
  currentValue: IExtendedPeoplePickerEntity[]
): IExtendedPeoplePickerEntity[] => {
  return searchResults.filter(
    (result) => !listContainsPeople(result, currentValue)
  );
};

export { handleDuplicates };
