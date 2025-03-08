import { Version } from '@microsoft/sp-core-library';
import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { Logger } from '@pnp/logging';
import {
  Elanguages,
  PropertyFieldMonacoEditor,
} from '@pnp/spfx-property-controls';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as strings from 'SitePickerWebPartStrings';
import type { INavigationModel } from '../../components/Navigation/INavigationProps';
import NavigationDisplay from './NavigationDisplay';

export interface ISitePickerWebPartProps {
  items: string;
}

export default class SitePickerWebPart extends BaseClientSideWebPart<ISitePickerWebPartProps> {
  public render(): void {
    let tempItems: INavigationModel[] = [
      {
        id: 'avengers',
        label: 'Avengers',
        children: [
          {
            id: 'iron_man',
            label: 'Iron Man',
            children: [
              {
                id: 'iron_man_1',
                label: 'Iron Man (2008)',
                link: 'https://www.imdb.com/title/tt0371746/',
              },
              {
                id: 'iron_man_2',
                label: 'Iron Man 2 (2010)',
                link: 'https://www.imdb.com/title/tt1228705/',
              },
              {
                id: 'iron_man_3',
                label: 'Iron Man 3 (2013)',
                link: 'https://www.imdb.com/title/tt1300854/',
              },
            ],
          },
          {
            id: 'captain_america',
            label: 'Captain America',
            children: [
              {
                id: 'captain_america_1',
                label: 'Captain America: The First Avenger (2011)',
                link: 'https://www.imdb.com/title/tt0458339/',
              },
              {
                id: 'captain_america_2',
                label: 'Captain America: The Winter Soldier (2014)',
                link: 'https://www.imdb.com/title/tt1843866/',
              },
              {
                id: 'captain_america_3',
                label: 'Captain America: Civil War (2016)',
                children: [
                  {
                    id: 'falcon_and_winter_soldier',
                    label: 'The Falcon and the Winter Soldier (2021)',
                    link: 'https://www.imdb.com/title/tt9208876/',
                  },
                ],
              },
            ],
          },
          {
            id: 'thor',
            label: 'Thor',
            children: [
              {
                id: 'thor_1',
                label: 'Thor (2011)',
                link: 'https://www.imdb.com/title/tt0800369/',
              },
              {
                id: 'thor_2',
                label: 'Thor: The Dark World (2013)',
                link: 'https://www.imdb.com/title/tt1981115/',
              },
              {
                id: 'thor_3',
                label: 'Thor: Ragnarok (2017)',
                link: 'https://www.imdb.com/title/tt3501632/',
              },
              {
                id: 'thor_4',
                label: 'Thor: Love and Thunder (2022)',
                link: 'https://www.imdb.com/title/tt10648342/',
              },
            ],
          },
          {
            id: 'hulk',
            label: 'Hulk',
            children: [
              {
                id: 'hulk_1',
                label: 'The Incredible Hulk (2008)',
                link: 'https://www.imdb.com/title/tt0800080/',
              },
            ],
          },
          {
            id: 'black_widow',
            label: 'Black Widow',
            children: [
              {
                id: 'black_widow_1',
                label: 'Iron Man 2 (2010)',
                link: 'https://www.imdb.com/title/tt1228705/',
              },

              {
                id: 'black_widow_2',
                label: 'The Avengers (2012)',
                link: 'https://www.imdb.com/title/tt0848228/',
              },

              {
                id: 'black_widow_3',
                label: 'Captain America: The Winter Soldier (2014)',
                link: 'https://www.imdb.com/title/tt1843866/',
              },

              {
                id: 'black_widow_4',
                label: 'Avengers: Age of Ultron (2015)',
                link: 'https://www.imdb.com/title/tt2395427/',
              },

              {
                id: 'black_widow_5',
                label: 'Captain America: Civil War (2016)',
                link: 'https://www.imdb.com/title/tt3498820/',
              },

              {
                id: 'black_widow_6',
                label: 'Avengers: Infinity War (2018)',
                link: 'https://www.imdb.com/title/tt4154756/',
              },

              {
                id: 'black_widow_7',
                label: 'Avengers: Endgame (2019)',
                link: 'https://www.imdb.com/title/tt4154796/',
              },

              {
                id: 'black_widow_8',
                label: 'Black Widow (2021)',
                link: 'https://www.imdb.com/title/tt3480822/',
              },
            ],
          },
          {
            id: 'hawkeye',
            label: 'Hawkeye',
            children: [
              {
                id: 'hawkeye_1',
                label: 'Thor (2011)',
                link: 'https://www.imdb.com/title/tt0800369/',
              },

              {
                id: 'hawkeye_2',
                label: 'The Avengers (2012)',
                link: 'https://www.imdb.com/title/tt0848228/',
              },

              {
                id: 'hawkeye_3',
                label: 'Avengers: Age of Ultron (2015)',
                link: 'https://www.imdb.com/title/tt2395427/',
              },

              {
                id: 'hawkeye_4',
                label: 'Captain America: Civil War (2016)',
                link: 'https://www.imdb.com/title/tt3498820/',
              },

              {
                id: 'hawkeye_5',
                label: 'Avengers: Endgame (2019)',
                link: 'https://www.imdb.com/title/tt4154796/',
              },

              {
                id: 'hawkeye_6',
                label: 'Hawkeye (2021)',
                link: 'https://www.imdb.com/title/tt10160804/',
              },
            ],
          },
          {
            id: 'spiderman',
            label: 'Spider-Man',
            children: [
              {
                id: 'spiderman_1',
                label: 'Spider-Man: Homecoming (2017)',
                link: 'https://www.imdb.com/title/tt2250912/',
              },

              {
                id: 'spiderman_2',
                label: 'Spider-Man: Far From Home (2019)',
                link: 'https://www.imdb.com/title/tt6320628/',
              },

              {
                id: 'spiderman_3',
                label: 'Spider-Man: No Way Home (2021)',
                link: 'https://www.imdb.com/title/tt10872600/',
              },
            ],
          },
          {
            id: 'ant_man',
            label: 'Ant-Man',
            children: [
              {
                id: 'ant_man_1',
                label: 'Ant-Man (2015)',
                link: 'https://www.imdb.com/title/tt0478970/',
              },

              {
                id: 'ant_man_2',
                label: 'Ant-Man and the Wasp (2018)',
                link: 'https://www.imdb.com/title/tt5095030/',
              },

              {
                id: 'ant_man_3',
                label: 'Ant-Man and the Wasp: Quantumania (2023)',
                link: 'https://www.imdb.com/title/tt10954600/',
              },
            ],
          },
          {
            id: 'doctor_strange',
            label: 'Doctor Strange',
            children: [
              {
                id: 'doctor_strange_1',
                label: 'Doctor Strange (2016)',
                link: 'https://www.imdb.com/title/tt1211837/',
              },

              {
                id: 'doctor_strange_2',
                label: 'Doctor Strange in the Multiverse of Madness (2022)',
                link: 'https://www.imdb.com/title/tt9419884/',
              },
            ],
          },
          {
            id: 'black_panther',
            label: 'Black Panther',
            children: [
              {
                id: 'black_panther_1',
                label: 'Black Panther (2018)',
                link: 'https://www.imdb.com/title/tt1825683/',
              },

              {
                id: 'black_panther_2',
                label: 'Black Panther: Wakanda Forever (2022)',
                link: 'https://www.imdb.com/title/tt9114286/',
              },
            ],
          },
          {
            id: 'eternals',
            label: 'Eternals',
            children: [
              {
                id: 'eternals_1',
                label: 'Eternals (2021)',
                link: 'https://www.imdb.com/title/tt9032400/',
              },
            ],
          },
        ],
      },
    ];
    try {
      tempItems = JSON.parse(this.properties.items);
    } catch (error) {
      Logger.error(error as Error);
    }
    const element: React.ReactElement = React.createElement(NavigationDisplay, {
      items: tempItems,
    });
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldMonacoEditor('items', {
                  key: 'items-editor',
                  language: Elanguages.json,
                  value: this.properties.items,
                  showLineNumbers: true,
                  showMiniMap: true,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
