import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { IPeoplePickerEntity } from "@pnp/sp/profiles";
import { getSP } from "../config";
import { IExtendedPeoplePickerEntity } from "../types";
import { generateImageUrl } from "../utils";

class PeopleSearchService {
  private extendedResults: IExtendedPeoplePickerEntity[] = [];
  private sp: SPFI;
  constructor(context: WebPartContext) {
    this.sp = getSP(context);
  }
  private allowUnInvalidated(user: IPeoplePickerEntity): boolean {
    return !(
      user.EntityData &&
      user.EntityData.PrincipalType &&
      user.EntityData.PrincipalType === "UNVALIDATED_EMAIL_ADDRESS"
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
            this.extendedResults.push({
              ...value,
              Image: generateImageUrl(context, value.Description),
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
