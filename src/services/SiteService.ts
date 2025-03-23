import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI } from '@pnp/sp';
import '@pnp/sp/sites';
import '@pnp/sp/webs';
import { ILinkItem } from '../components/SiteBreadcrumb/ISiteBreadcrumbProps';
import { getSp } from '../config/pnp.config';

/**
 * Service class for retrieving breadcrumb navigation data in SharePoint.
 */
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
   * Retrieves breadcrumb navigation data from the current site up to the root site collection.
   * @returns {Promise<ILinkItem[]>} - A function returning an array of breadcrumb link items.
   */
  public async getBreadcrumbData(): Promise<ILinkItem[]> {
    const linkItems: ILinkItem[] = [];
    try {
      let currentWeb = this.sp.web;

      /**
       * Get root site URL
       */
      const rootSite = await this.sp.site.select('Url')();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const webInfo = await currentWeb.select('Title', 'ServerRelativeUrl')();

        linkItems.unshift({
          key: webInfo.ServerRelativeUrl,
          label: webInfo.Title,
          href: webInfo.ServerRelativeUrl,
        });

        if (
          webInfo.ServerRelativeUrl ===
          rootSite.Url.replace(window.location.origin, '')
        ) {
          break;
        }

        try {
          currentWeb = await currentWeb.getParentWeb();
        } catch {
          break;
        }
      }
    } catch (error) {
      console.error('Error fetching breadcrumb:', error);
    }

    return linkItems;
  }
}
