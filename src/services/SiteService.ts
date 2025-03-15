import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { getSp } from '../config/pnp.config';

interface LinkItems {
  label: string;
  key: string;
  href: string;
  isCurrentItem?: boolean;
}

class SiteService {
  private sp: SPFI;
  private _linkItems: LinkItems[] = [];
  constructor(context: WebPartContext) {
    this.sp = getSp(context);
  }

  private async getParentWeb(
    context: WebPartContext,
    webUrl: string
  ): Promise<void> {
    try {
      const response = await this.sp.web.getParentWeb().then((response) => {
        return response.select('Id', 'Title', 'ServerRelativeUrl')();
      });
      if (!response.ServerRelativeUrl && !response.Title) {
        return;
      }
      this._linkItems.unshift({
        label: response.Title,
        key: response.Id,
        href: response.ServerRelativeUrl,
      });

      if (
        response.ServerRelativeUrl ===
        context.pageContext.site.serverRelativeUrl
      ) {
        return;
      } else {
        webUrl = webUrl.substring(
          0,
          webUrl.indexOf(`${response.ServerRelativeUrl}/`) +
            response.ServerRelativeUrl.length
        );
        return this.getParentWeb(context, webUrl);
      }
    } catch {
      /* empty */
    }
  }

  public generateBreadcrumbs(context: WebPartContext): LinkItems[] | undefined {
    this._linkItems.push({
      label: context.pageContext.web.title,
      key: context.pageContext.web.id.toString(),
      href: context.pageContext.web.absoluteUrl,
      isCurrentItem:
        !!context.pageContext.list &&
        !context.pageContext.list.serverRelativeUrl,
    });
    if (
      context.pageContext.site.serverRelativeUrl ===
      context.pageContext.web.serverRelativeUrl
    ) {
      return this._linkItems;
    } else {
      if (Environment.type === EnvironmentType.Test) {
        return this._linkItems;
      } else {
        this.getParentWeb(context, context.pageContext.web.absoluteUrl);
      }
    }
  }
}

export { SiteService, type LinkItems };
