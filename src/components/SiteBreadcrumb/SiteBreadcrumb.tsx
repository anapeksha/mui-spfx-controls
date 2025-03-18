import { Breadcrumbs, Link } from '@mui/material';
import { Logger } from '@pnp/logging';
import React, {
  forwardRef,
  ForwardRefExoticComponent,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { LinkItems, SiteService } from '../../services/SiteService';
import { ISiteBreadcrumbProps } from './ISiteBreadcrumbProps';

const SiteBreadcrumb: ForwardRefExoticComponent<ISiteBreadcrumbProps> =
  forwardRef(({ context, ...breadcrumbProps }, ref: RefObject<HTMLElement>) => {
    const siteService = new SiteService(context);
    const [breadcrumbData, setBreadcrumbData] = useState<
      LinkItems[] | undefined
    >([]);

    useEffect(() => {
      const fetchData = async (): Promise<void> => {
        try {
          const generatedBreadcrumbData =
            siteService.generateBreadcrumbs(context);
          console.log(generatedBreadcrumbData);
          setBreadcrumbData(generatedBreadcrumbData);
        } catch (error) {
          Logger.error(error);
        }
      };
      fetchData();
    }, []);

    return (
      <Breadcrumbs {...breadcrumbProps} aria-label="breadcrumb" ref={ref}>
        {breadcrumbData
          ? breadcrumbData.map(({ label, href, key }) => (
              <Link href={href} key={key}>
                {label}
              </Link>
            ))
          : null}
      </Breadcrumbs>
    );
  });

export default SiteBreadcrumb;
