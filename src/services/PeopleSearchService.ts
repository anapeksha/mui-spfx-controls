import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PrincipalSource, PrincipalType, SPFI } from '@pnp/sp';
import { IPeoplePickerEntity as IBasePeoplePickerEntity } from '@pnp/sp/profiles';
import { ISiteUser } from '@pnp/sp/site-users/types';
import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';
import { getSP } from '../config';
import { generateImageUrl } from '../utils';

class PeopleSearchService {
  private extendedResults: IPeoplePickerEntity[] = [];
  private sp: SPFI;
  private image?: string;
  constructor(context: WebPartContext) {
    this.sp = getSP(context);
  }
  private restrictUnInvalidated(user: IBasePeoplePickerEntity): boolean {
    return !(
      user.EntityData &&
      user.EntityData.PrincipalType &&
      user.EntityData.PrincipalType === 'UNVALIDATED_EMAIL_ADDRESS'
    );
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
            if (value.Description && value.Description !== '') {
              this.image = generateImageUrl(context, value.Description);
            } else if (
              value.EntityData.Email &&
              value.EntityData.Email !== ''
            ) {
              this.image = generateImageUrl(context, value.EntityData.Email);
            }
            this.extendedResults.push({
              ...value,
              Image: this.image as string,
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

  public findUserByEmail(email: string): ISiteUser {
    return this.sp.web.siteUsers.getByEmail(email);
  }
}

export { PeopleSearchService };
