import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { getSP } from "../config";

class CalendarService {
  private sp: SPFI;
  constructor(context: WebPartContext) {
    this.sp = getSP(context);
  }
}

export { CalendarService };
