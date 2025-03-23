import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PrincipalSource, PrincipalType, SPFI } from '@pnp/sp';
import { IPeoplePickerEntity as IBasePeoplePickerEntity } from '@pnp/sp/profiles';
import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';
import { getSp } from '../config/pnp.config';
import { generateImageUrl } from '../utils/generateImageUrl';

/**
 * Service class for interacting with SharePoint People Picker.
 */
class PeopleService {
  private sp: SPFI;

  /**
   * Initializes the PeopleService instance.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   */
  constructor(context: WebPartContext) {
    this.sp = getSp(context);
  }

  /**
   * Restricts unvalidated email addresses from appearing in search results.
   * @param {IBasePeoplePickerEntity} user - The user entity to validate.
   * @returns {boolean} - Returns true if the user is validated, otherwise false.
   */
  private restrictUnInvalidated(user: IBasePeoplePickerEntity): boolean {
    if (user.EntityData.PrincipalType) {
      return user.EntityData.PrincipalType !== 'UNVALIDATED_EMAIL_ADDRESS';
    }
    return true;
  }

  /**
   * Searches for users in SharePoint based on a query string.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   * @param {string} query - The search query string.
   * @param {number} [maximumSuggestions=25] - The maximum number of suggestions to return.
   * @returns {Promise<IPeoplePickerEntity[]>} - A list of matched people entities.
   */
  public async searchUser(
    context: WebPartContext,
    query: string,
    maximumSuggestions?: number
  ): Promise<IPeoplePickerEntity[]> {
    const response = await this.sp.profiles.clientPeoplePickerSearchUser({
      AllowEmailAddresses: true,
      AllowMultipleEntities: false,
      AllUrlZones: false,
      MaximumEntitySuggestions: maximumSuggestions || 25,
      PrincipalSource: PrincipalSource.All,
      PrincipalType: PrincipalType.All,
      QueryString: query,
    });

    response.filter((value) => this.restrictUnInvalidated(value));
    return response.map((value) => {
      let image = '';
      if (value.Description && value.Description !== '') {
        image = generateImageUrl(context, value.Description);
      } else if (value.EntityData.Email && value.EntityData.Email !== '') {
        image = generateImageUrl(context, value.EntityData.Email);
      }
      return { ...value, Image: image };
    });
  }

  /**
   * Resolves a single user based on a query string.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   * @param {string} query - The user query string.
   * @returns {Promise<IPeoplePickerEntity>} - The resolved user entity.
   */
  public async resolveUser(
    context: WebPartContext,
    query: string
  ): Promise<IPeoplePickerEntity> {
    const resolvedUser = await this.sp.profiles.clientPeoplePickerResolveUser({
      AllowEmailAddresses: true,
      AllowMultipleEntities: false,
      AllUrlZones: false,
      MaximumEntitySuggestions: 25,
      PrincipalSource: PrincipalSource.All,
      PrincipalType: PrincipalType.All,
      QueryString: query,
    });

    let image = '';
    if (resolvedUser.Description && resolvedUser.Description !== '') {
      image = generateImageUrl(context, resolvedUser.Description);
    } else if (
      resolvedUser.EntityData.Email &&
      resolvedUser.EntityData.Email !== ''
    ) {
      image = generateImageUrl(context, resolvedUser.EntityData.Email);
    }
    return {
      ...resolvedUser,
      Image: image,
    };
  }
}

export { PeopleService };
