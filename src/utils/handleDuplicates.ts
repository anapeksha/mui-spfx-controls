import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';

const listContainsPeople = (
  user: IPeoplePickerEntity,
  users: IPeoplePickerEntity[]
): IPeoplePickerEntity[] | boolean => {
  if (!users || !users.length || users.length === 0) {
    return false;
  } else {
    return users.some((value) => value.Key === user.Key);
  }
};

export const handleDuplicates = (
  searchResults: IPeoplePickerEntity[],
  currentValue: IPeoplePickerEntity[]
): IPeoplePickerEntity[] => {
  return searchResults.filter(
    (result) => !listContainsPeople(result, currentValue)
  );
};
