import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { INavigationProps } from '../src/components/Navigation/INavigationProps';
import Navigation from '../src/components/Navigation/Navigation';

describe('<Navigation />', () => {
  let props: INavigationProps;
  props = {
    items: [
      {
        id: 'iron_man',
        label: 'Iron Man',
        children: [
          {
            id: 'iron_man_1',
            label: 'Iron Man (2008)',
            link: 'https://www.imdb.com/title/tt0371746/',
          },
        ],
      },
    ],
  };

  /** It should render the navigation component properly */
  it('Should render the component', async () => {
    await act(async () => {
      render(<Navigation {...props} />);
    });

    expect(screen.getByTestId('mui-spfx-navigation')).toBeInTheDocument();
  });

  /** Should expand and collapse item */
  it('Should expand & collapse items on click', async () => {
    await act(async () => {
      render(<Navigation {...props} />);
    });

    const parentNode = screen.getByText('Iron Man');
    expect(screen.queryByText('Iron Man (2008)')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(parentNode);
    });

    expect(screen.getByText('Iron Man (2008)')).toBeInTheDocument();
  });
});
