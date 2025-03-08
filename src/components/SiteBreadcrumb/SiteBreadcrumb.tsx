import { Breadcrumbs, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LinkItems, SiteService } from '../../services';
import { ISiteBreadcrumbProps } from './ISiteBreadcrumbProps';

const SiteBreadcrumb: React.FC<ISiteBreadcrumbProps> = ({
  context,
  ...breadcrumbProps
}) => {
  const siteService = new SiteService(context);
  const [breadcrumbData, setBreadcrumbData] = useState<LinkItems[] | undefined>(
    []
  );

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const generatedBreadcrumbData = siteService.generateBreadcrumbs(context);
      setBreadcrumbData(generatedBreadcrumbData);
    };
    fetchData();
  }, []);

  return (
    <Breadcrumbs {...breadcrumbProps} aria-label="breadcrumb">
      {breadcrumbData
        ? breadcrumbData.map(({ label, href, key }) => (
            <Link href={href} key={key}>
              {label}
            </Link>
          ))
        : null}
    </Breadcrumbs>
  );
};

export default SiteBreadcrumb;
