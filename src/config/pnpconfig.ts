import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx as SpSPFx } from '@pnp/sp';
import { graphfi, GraphFI, SPFx as GraphSPFx } from '@pnp/graph';
import '@pnp/sp/batching';
import '@pnp/sp/items';
import '@pnp/sp/lists';
import '@pnp/sp/profiles';
import '@pnp/sp/site-users/web';
import '@pnp/sp/webs';
import '@pnp/sp/fields';
import '@pnp/sp/items/get-all';

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
