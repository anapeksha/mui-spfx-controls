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
import { LinkItem, SiteService } from '../../services/SiteService';
import { ISiteBreadcrumbProps } from './ISiteBreadcrumbProps';

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
        LinkItem[] | undefined
      >([]);

      useEffect(() => {
        const fetchData = async (): Promise<void> => {
          try {
            const generatedBreadcrumbData =
              await siteService.generateBreadcrumbData(context);
            setBreadcrumbData(generatedBreadcrumbData);
          } catch (error) {
            Logger.error(error);
          }
        };
        fetchData();
      }, []);

      return (
        <Breadcrumbs
          maxItems={3}
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
                      key={data.key}
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
                    <Typography color="textPrimary" key={data.key}>
                      {data.label}
                    </Typography>
                  );
                } else {
                  return renderItem ? (
                    renderItem(data)
                  ) : (
                    <Link
                      color="inherit"
                      underline="hover"
                      href={data.href}
                      key={data.key}
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
