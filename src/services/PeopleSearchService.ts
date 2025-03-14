import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PrincipalSource, PrincipalType, SPFI } from '@pnp/sp';
import { IPeoplePickerEntity as IBasePeoplePickerEntity } from '@pnp/sp/profiles';
import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';
import { getSP } from '../config/pnp.config';
import { generateImageUrl } from '../utils/generateImageUrl';

class PeopleSearchService {
  private extendedResults: IPeoplePickerEntity[] = [];
  private sp: SPFI;
  constructor(context: WebPartContext) {
    this.sp = getSP(context);
  }
  private restrictUnInvalidated(user: IBasePeoplePickerEntity): boolean {
    if (user.EntityData.PrincipalType) {
      if (user.EntityData.PrincipalType === 'UNVALIDATED_EMAIL_ADDRESS') {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  public async searchUser(
    context: WebPartContext,
    query: string,
    maximumSuggestions?: number
  ): Promise<IPeoplePickerEntity[]> {
    return new Promise<IPeoplePickerEntity[]>((resolve, reject) => {
      this.sp.profiles
        .clientPeoplePickerSearchUser({
          AllowEmailAddresses: true,
          AllowMultipleEntities: false,
          AllUrlZones: false,
          MaximumEntitySuggestions: maximumSuggestions || 25,
          PrincipalSource: PrincipalSource.All,
          PrincipalType: PrincipalType.All,
          QueryString: query,
        })
        .then((response) => {
          response.filter((value) => this.restrictUnInvalidated(value));
          response.forEach((value) => {
            let image = '';
            if (value.Description && value.Description !== '') {
              image = generateImageUrl(context, value.Description);
            } else if (
              value.EntityData.Email &&
              value.EntityData.Email !== ''
            ) {
              image = generateImageUrl(context, value.EntityData.Email);
            }
            this.extendedResults.push({
              ...value,
              Image: image,
            });
          });
          resolve(this.extendedResults);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

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
    return {
      ...resolvedUser,
      Image: generateImageUrl(context, resolvedUser.EntityData.Email),
    };
  }
}

export { PeopleSearchService };
