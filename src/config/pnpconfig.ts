import { WebPartContext } from '@microsoft/sp-webpart-base';
import { graphfi, GraphFI, SPFx as GraphSPFx } from '@pnp/graph';
import { spfi, SPFI, SPFx as SpSPFx } from '@pnp/sp';
import '@pnp/sp/batching';
import '@pnp/sp/fields';
import '@pnp/sp/items';
import '@pnp/sp/items/get-all';
import '@pnp/sp/lists';
import '@pnp/sp/profiles';
import '@pnp/sp/security';
import '@pnp/sp/site-users/web';
import '@pnp/sp/webs';

let _sp: SPFI;
let _graph: GraphFI;

export const getSP = (context?: WebPartContext): SPFI => {
  if (!!context) {
    _sp = spfi().using(SpSPFx(context));
  }
  return _sp;
};

export const getGraph = (context?: WebPartContext): GraphFI => {
  if (!!context) {
    _graph = graphfi().using(GraphSPFx(context));
  }
  return _graph;
};
