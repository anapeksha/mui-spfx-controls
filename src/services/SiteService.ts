import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import { IWeb } from '@pnp/sp/webs';
import { ILinkItem } from '../components/SiteBreadcrumb/ISiteBreadcrumbProps';
import { getSp } from '../config/pnp.config';

export class SiteService {
  private sp: SPFI;

  /**
   * Initializes the SiteService instance.
   * @param {WebPartContext} context - The SharePoint WebPart context.
   */
  constructor(context: WebPartContext) {
    this.sp = getSp(context);
  }

  /**
   * Recursively generates breadcrumb data from the current site up to the root site collection.
   * @param {IWeb} web - The current site web instance.
   * @param {string} rootUrl - The root site absolute URL.
   * @param {ILinkItem[]} breadcrumbs - The collected breadcrumb items.
   * @returns {Promise<ILinkItem[]>} A promise resolving to the breadcrumb items.
   */
  private async generateData(
    web: IWeb,
    rootUrl: string,
    breadcrumbs: ILinkItem[] = []
  ): Promise<ILinkItem[]> {
    try {
      const webInfo = await web.select('Title', 'ServerRelativeUrl', 'Id')();

      if (!webInfo || !webInfo.Title || !webInfo.ServerRelativeUrl) {
        return breadcrumbs;
      }

      // Add current site to the breadcrumb list
      breadcrumbs.unshift({
        key: webInfo.Id,
        label: webInfo.Title,
        href: webInfo.ServerRelativeUrl,
      });

      // Stop recursion when reaching the root site
      if (webInfo.ServerRelativeUrl === new URL(rootUrl).pathname) {
        return breadcrumbs;
      }

      // Fetch parent site
      try {
        const parentWeb = await web.getParentWeb();
        return this.generateData(parentWeb, rootUrl, breadcrumbs);
      } catch {
        return breadcrumbs;
      }
    } catch {
      return breadcrumbs;
    }
  }

  /**
   * Retrieves breadcrumb navigation data from the current site up to the root site collection.
   * @returns {Promise<ILinkItem[]>} A promise resolving to an array of breadcrumb link items.
   */
  public async getBreadcrumbData(): Promise<ILinkItem[]> {
    try {
      const rootSite = await this.sp.site.select('Url')();

      const data = await this.generateData(this.sp.web, rootSite.Url, []);

      return data;
    } catch {
      return [];
    }
  }
}
