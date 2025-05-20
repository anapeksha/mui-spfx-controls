import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ILinkItem } from '../../src/components/SiteBreadcrumb/ISiteBreadcrumbProps';

export const mockSiteData: ILinkItem[] = [
  {
    key: '1',
    label: 'Mock SharePoint Site',
    href: 'https://example.sharepoint.com/sites/mocksite',
  },
  {
    key: '2',
    label: 'Mock SharePoint Site - Level 2',
    href: 'https://example.sharepoint.com/sites/mocksite/level2',
  },
];

export class SiteService {
  constructor(context: WebPartContext) {}

  public async getBreadcrumbData(): Promise<ILinkItem[]> {
    return Promise.resolve(mockSiteData);
  }
}
