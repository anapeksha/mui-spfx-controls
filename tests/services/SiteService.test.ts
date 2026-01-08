jest.mock('../../src/config/pnp.config', () => {
  const mockSPFI = {
    web: Object.assign(jest.fn(), {
      select: jest.fn().mockReturnThis(),
      getParentWeb: jest.fn(),
    }),
    site: Object.assign(jest.fn(), {
      select: jest.fn().mockReturnThis(),
    }),
  };

  return {
    getSp: jest.fn(() => mockSPFI),
    getGraph: jest.fn(() => ({})),
  };
});

import { SiteService } from '../../src/services/SiteService';
import { mockedContext } from '../mocks/context';
import { getSp } from '../../src/config/pnp.config';

describe('SiteService', () => {
  let service: SiteService;
  let mockSp: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SiteService(mockedContext);
    mockSp = getSp();
  });

  describe('getBreadcrumbData', () => {
    it('should handle root site without parent', async () => {
      const rootUrl = 'https://contoso.sharepoint.com';
      const rootPathname = '/';

      const rootWebInfo = {
        Id: 'web-id-1',
        Title: 'Root Site',
        ServerRelativeUrl: rootPathname,
      };

      (mockSp.site as any).mockResolvedValue({ Url: rootUrl });
      (mockSp.web as any).mockResolvedValue(rootWebInfo);

      const result = await service.getBreadcrumbData();

      expect(result).toEqual([
        {
          key: 'web-id-1',
          label: 'Root Site',
          href: rootPathname,
        },
      ]);
    });

    it('should return empty array on site error', async () => {
      (mockSp.site as any).mockRejectedValue(new Error('Site not found'));

      const result = await service.getBreadcrumbData();

      expect(result).toEqual([]);
    });

    it('should handle web info without title', async () => {
      const rootUrl = 'https://contoso.sharepoint.com';

      const invalidWebInfo = {
        Id: 'web-id-1',
        ServerRelativeUrl: '/sites/test',
      };

      (mockSp.site as any).mockResolvedValue({ Url: rootUrl });
      (mockSp.web as any).mockResolvedValue(invalidWebInfo);

      const result = await service.getBreadcrumbData();

      expect(result).toEqual([]);
    });

    it('should handle web info without ServerRelativeUrl', async () => {
      const rootUrl = 'https://contoso.sharepoint.com';

      const invalidWebInfo = {
        Id: 'web-id-1',
        Title: 'Test Site',
      };

      (mockSp.site as any).mockResolvedValue({ Url: rootUrl });
      (mockSp.web as any).mockResolvedValue(invalidWebInfo);

      const result = await service.getBreadcrumbData();

      expect(result).toEqual([]);
    });

    it('should handle parent web fetch error gracefully', async () => {
      const rootUrl = 'https://contoso.sharepoint.com/sites/test';

      const webInfo = {
        Id: 'web-id-1',
        Title: 'Current Site',
        ServerRelativeUrl: '/sites/current',
      };

      (mockSp.site as any).mockResolvedValue({ Url: rootUrl });
      (mockSp.web as any).mockResolvedValue(webInfo);
      mockSp.web.getParentWeb.mockRejectedValue(new Error('Parent not accessible'));

      const result = await service.getBreadcrumbData();

      expect(result).toEqual([
        {
          key: 'web-id-1',
          label: 'Current Site',
          href: '/sites/current',
        },
      ]);
    });

    it('should handle web fetch error', async () => {
      const rootUrl = 'https://contoso.sharepoint.com';

      (mockSp.site as any).mockResolvedValue({ Url: rootUrl });
      (mockSp.web as any).mockRejectedValue(new Error('Web not found'));

      const result = await service.getBreadcrumbData();

      expect(result).toEqual([]);
    });
  });
});
