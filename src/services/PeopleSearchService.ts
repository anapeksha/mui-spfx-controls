import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { IPeoplePickerEntity } from '@pnp/sp/profiles';
import { getSP } from '../config';
import { IExtendedPeoplePickerEntity } from '../components/PeoplePicker/IExtendedPeoplePicker';
import { generateImageUrl } from '../utils';

class PeopleSearchService {
  private extendedResults: IExtendedPeoplePickerEntity[] = [];
  private sp: SPFI;
  private image: string;
  constructor(context: WebPartContext) {
    this.sp = getSP(context);
  }
  private allowUnInvalidated(user: IPeoplePickerEntity): boolean {
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
          PrincipalSource: 15,
          PrincipalType: 1,
          QueryString: query,
        })
        .then((response) => {
          response.filter((value) => this.allowUnInvalidated(value));
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
              Image: this.image,
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
