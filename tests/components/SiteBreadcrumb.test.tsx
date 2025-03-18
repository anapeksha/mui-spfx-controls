jest.mock('../../src/services/SiteService', () =>
  jest.requireActual('../mocks/SiteService')
);

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import SiteBreadcrumb, {
  ISiteBreadcrumbProps,
} from '../../src/components/SiteBreadcrumb';
import { mockedContext } from '../mocks/context';

describe('<SiteBreadcrumb />', () => {
  const props: ISiteBreadcrumbProps = {
    context: mockedContext,
  };
  it('renders the SiteBreadcrumb component', async () => {
    await act(async () => {
      render(<SiteBreadcrumb {...props} />);
    });

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('navigates to the correct breadcrumb link when clicked', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(window, 'open').mockImplementation(mockNavigate);

    await act(async () => {
      render(<SiteBreadcrumb {...props} />);
    });

    const firstBreadcrumb = screen.getByText(/home/i);
    await act(async () => {
      await userEvent.click(firstBreadcrumb);
    });

    expect(mockNavigate).toHaveBeenCalled();
  });
});
