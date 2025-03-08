import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PrincipalSource, PrincipalType, SPFI } from '@pnp/sp';
import { IPeoplePickerEntity } from '@pnp/sp/profiles';
import { IExtendedPeoplePickerEntity } from '../components/PeoplePicker/IExtendedPeoplePicker';
import { getSP } from '../config';
import { generateImageUrl } from '../utils';

class PeopleSearchService {
  private extendedResults: IExtendedPeoplePickerEntity[] = [];
  private sp: SPFI;
  private image?: string;
  constructor(context: WebPartContext) {
    this.sp = getSP(context);
  }
  private restrictUnInvalidated(user: IPeoplePickerEntity): boolean {
    return !(
      user.EntityData &&
      user.EntityData.PrincipalType &&
      user.EntityData.PrincipalType === 'UNVALIDATED_EMAIL_ADDRESS'
    );
  }
  public async resolveUser(
    context: WebPartContext,
    query: string,
    maximumSuggestions?: number
  ): Promise<IExtendedPeoplePickerEntity[]> {
    return new Promise<IExtendedPeoplePickerEntity[]>((resolve, reject) => {
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
}

export { PeopleSearchService };
