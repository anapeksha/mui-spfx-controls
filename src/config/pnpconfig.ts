import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/batching";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/profiles";
import "@pnp/sp/webs";

let _sp: SPFI;

export const getSP = (context?: WebPartContext): SPFI => {
  if (!!context) {
    _sp = spfi().using(SPFx(context));
  }
  return _sp;
};
