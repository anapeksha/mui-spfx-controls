import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PrincipalSource, PrincipalType, SPFI } from '@pnp/sp';
import { IPeoplePickerEntity as IBasePeoplePickerEntity } from '@pnp/sp/profiles';
import { IPeoplePickerEntity } from '../components/PeoplePicker/IPeoplePickerProps';
import { getSp } from '../config/pnp.config';
import { generateImageUrl } from '../utils/generateImageUrl';

class PeopleService {
  private sp: SPFI;
  constructor(context: WebPartContext) {
    this.sp = getSp(context);
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
