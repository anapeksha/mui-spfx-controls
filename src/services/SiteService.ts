import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { getSp } from '../config/pnp.config';

interface LinkItem {
  label: string;
  key: string;
  href: string;
  isCurrentItem?: boolean;
}

class SiteService {
  private sp: SPFI;
  private _linkItems: LinkItem[] = [];

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
      if (!response?.ServerRelativeUrl || !response?.Title) {
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
      }

      const newWebUrl = webUrl.substring(
        0,
        webUrl.indexOf(`${response.ServerRelativeUrl}/`) +
          response.ServerRelativeUrl.length
      );

      await this.getParentWeb(context, newWebUrl);
    } catch (error) {
      console.error('Error fetching parent web:', error);
    }
  }

  public async generateBreadcrumbData(
    context: WebPartContext
  ): Promise<LinkItem[]> {
    this._linkItems = [];

    this._linkItems.push({
      label: context.pageContext.web.title,
      key: context.pageContext.web.id.toString(),
      href: context.pageContext.web.absoluteUrl,
      isCurrentItem:
        !!context.pageContext.list &&
        !context.pageContext.list.serverRelativeUrl,
    });

    if (
      context.pageContext.site.serverRelativeUrl !==
      context.pageContext.web.serverRelativeUrl
    ) {
      await this.getParentWeb(context, context.pageContext.web.absoluteUrl);
    }
    return this._linkItems;
  }
}

export { SiteService, type LinkItem };
