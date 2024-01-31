import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { IPeoplePickerEntity } from "@pnp/sp/profiles";
import { getSP } from "../config";
import { IExtendedPeoplePickerEntity } from "../types";
import { generateImageUrl } from "../utils";

class PeopleSearchService {
  private extendedResults: IExtendedPeoplePickerEntity[] = [];
  private uniqueUsers: IPeoplePickerEntity[] = [];
  private keys: string[] = [];
  private sp: SPFI;
  constructor(context: WebPartContext) {
    this.sp = getSP(context);
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
          MaximumEntitySuggestions: maximumSuggestions || 50,
          QueryString: query,
          PrincipalType: 1,
        })
        .then((response) => {
          this.keys = response.map((value) => value.Key);
          this.uniqueUsers = response.filter(
            (value, index) => this.keys.lastIndexOf(value.Key) !== index
          );
          this.uniqueUsers.forEach((value) => {
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
