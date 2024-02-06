import { WebPartContext } from "@microsoft/sp-webpart-base";
import { graphfi, GraphFI, SPFx as GraphSPFx } from "@pnp/graph";
import "@pnp/graph/calendars";
import "@pnp/graph/users";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/batching";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/profiles";
import "@pnp/sp/site-users/web";
import "@pnp/sp/webs";

let _sp: SPFI;
let _graph: GraphFI;

export const getSP = (context?: WebPartContext): SPFI => {
  if (!!context) {
    _sp = spfi().using(SPFx(context));
  }
  return _sp;
};

export const getGraph = (context?: WebPartContext): GraphFI => {
  if (!!context) {
    _graph = graphfi().using(GraphSPFx(context));
  }
  return _graph;
};
