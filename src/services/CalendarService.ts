import { Calendar } from "@microsoft/microsoft-graph-types";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { GraphFI } from "@pnp/graph";
import { getGraph } from "../config";

class CalendarService {
  private graph: GraphFI;
  constructor(context: WebPartContext) {
    this.graph = getGraph(context);
  }
  public getUserCalendars(): Promise<Calendar> {
    return new Promise((resolve, reject) => {
      this.graph.me
        .calendar()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export { CalendarService };
