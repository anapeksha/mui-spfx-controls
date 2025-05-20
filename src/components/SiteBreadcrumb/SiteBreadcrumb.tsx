import { Home } from '@mui/icons-material';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Logger } from '@pnp/logging';
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { SiteService } from '../../services/SiteService';
import { ILinkItem, ISiteBreadcrumbProps } from './ISiteBreadcrumbProps';

const SiteBreadcrumb: ForwardRefExoticComponent<ISiteBreadcrumbProps> =
  forwardRef(
    (
      {
        context,
        renderFirstItem,
        renderItem,
        renderLastItem,
        ...breadcrumbProps
      },
      ref: RefObject<HTMLElement>
    ) => {
      const siteService = new SiteService(context);
      const [breadcrumbData, setBreadcrumbData] = useState<
        ILinkItem[] | undefined
      >([]);

      useEffect(() => {
        const fetchData = async (): Promise<void> => {
          try {
            const generatedBreadcrumbData =
              await siteService.getBreadcrumbData();
            setBreadcrumbData(generatedBreadcrumbData);
          } catch (error) {
            Logger.error(error);
          }
        };

        fetchData();
      }, []);

      return (
        <Breadcrumbs
          data-testid="mui-spfx-breadcrumb"
          maxItems={5}
          aria-label="breadcrumb"
          {...breadcrumbProps}
          ref={ref}
        >
          {breadcrumbData
            ? breadcrumbData.map((data, index) => {
                if (index === 0) {
                  return renderFirstItem ? (
                    renderFirstItem(data)
                  ) : (
                    <Link
                      aria-label="Home"
                      href={data.href}
                      underline="hover"
                      key={`${data.key}-${index}`}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Home fontSize="inherit" sx={{ mr: 0.5 }} />
                      {data.label}
                    </Link>
                  );
                } else if (index === breadcrumbData.length - 1) {
                  return renderLastItem ? (
                    renderLastItem(data)
                  ) : (
                    <Typography
                      aria-label="Current site"
                      color="textSecondary"
                      key={`${data.key}-${index}`}
                    >
                      {data.label}
                    </Typography>
                  );
                } else {
                  return renderItem ? (
                    renderItem(data)
                  ) : (
                    <Link
                      aria-label="Site links"
                      underline="hover"
                      href={data.href}
                      key={`${data.key}-${index}`}
                    >
                      {data.label}
                    </Link>
                  );
                }
              })
            : null}
        </Breadcrumbs>
      );
    }
  );

export default SiteBreadcrumb;
