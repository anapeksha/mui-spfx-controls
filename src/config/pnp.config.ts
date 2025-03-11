import { WebPartContext } from '@microsoft/sp-webpart-base';
import { graphfi, GraphFI, SPFx as GraphSPFx } from '@pnp/graph';
import { BrowserFetchWithRetry, Caching } from '@pnp/queryable';
import { spfi, SPFI, SPFx as SpSPFx } from '@pnp/sp';
import '@pnp/sp/batching';
import '@pnp/sp/fields';
import '@pnp/sp/items';
import '@pnp/sp/lists';
import '@pnp/sp/profiles';
import '@pnp/sp/search';
import '@pnp/sp/security';
import '@pnp/sp/site-users/web';
import '@pnp/sp/sites';
import '@pnp/sp/webs';

let _sp: SPFI;
let _graph: GraphFI;

export const getSP = (context?: WebPartContext): SPFI => {
  if (!!context) {
    _sp = spfi()
      .using(SpSPFx(context))
      .using(Caching())
      .using(BrowserFetchWithRetry({ retries: 5 }));
  }
  return _sp;
};

export const getGraph = (context?: WebPartContext): GraphFI => {
  if (!!context) {
    _graph = graphfi()
      .using(GraphSPFx(context))
      .using(Caching())
      .using(BrowserFetchWithRetry({ retries: 5 }));
  }
  return _graph;
};
