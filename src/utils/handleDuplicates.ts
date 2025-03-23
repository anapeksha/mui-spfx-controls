import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';

/**
 * Checks if a given user exists within a list of users.
 *
 * @param {IPeoplePickerEntity} user - The user to check.
 * @param {IPeoplePickerEntity[]} users - The list of users.
 * @returns {IPeoplePickerEntity[] | boolean} - Returns true if the user exists, otherwise false.
 */
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

/**
 * Filters out duplicate users from search results based on the current selection.
 *
 * @param {IPeoplePickerEntity[]} searchResults - The list of users retrieved from the search.
 * @param {IPeoplePickerEntity[]} currentValue - The list of already selected users.
 * @returns {IPeoplePickerEntity[]} - A filtered list containing only unique users.
 */
export const handleDuplicates = (
  searchResults: IPeoplePickerEntity[],
  currentValue: IPeoplePickerEntity[]
): IPeoplePickerEntity[] => {
  return searchResults.filter(
    (result) => !listContainsPeople(result, currentValue)
  );
};
