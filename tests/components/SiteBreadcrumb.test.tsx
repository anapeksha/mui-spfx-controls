jest.mock('../../src/services/SiteService', () =>
  jest.requireActual('../mocks/SiteService')
);

import { act, render, screen } from '@testing-library/react';
import React from 'react';
import {
  ISiteBreadcrumbProps,
  SiteBreadcrumb,
} from '../../src/components/SiteBreadcrumb';
import { mockedContext } from '../mocks/context';

describe('<SiteBreadcrumb />', () => {
  const props: ISiteBreadcrumbProps = {
    context: mockedContext,
  };

  /** Should render the explorer component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<SiteBreadcrumb {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-breadcrumb')).toBeInTheDocument();
  });
});
