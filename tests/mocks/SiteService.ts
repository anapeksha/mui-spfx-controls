import { WebPartContext } from '@microsoft/sp-webpart-base';

export const mockSiteData = {
  Title: 'Mock SharePoint Site',
  Url: 'https://example.sharepoint.com/sites/mocksite',
};

export const mockBreadcrumb = [
  { title: 'Home', url: '/' },
  { title: 'Documents', url: '/Documents' },
  { title: 'Current Page', url: '#' },
];

export class SiteService {
  constructor(context: WebPartContext) {}

  public async getSiteDetails(): Promise<any> {
    return Promise.resolve(mockSiteData);
  }

  public async getBreadcrumb(): Promise<any[]> {
    return Promise.resolve(mockBreadcrumb);
  }
}
