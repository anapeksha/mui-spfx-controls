import { WebPartContext } from '@microsoft/sp-webpart-base';

export const mockSearchResults = [
  {
    Title: 'Test Document 1',
    Path: 'https://example.com/doc1',
  },
  {
    Title: 'Test Document 2',
    Path: 'https://example.com/doc2',
  },
];

export class SearchService {
  constructor(context: WebPartContext) {}

  public async search(query: string): Promise<any[]> {
    return Promise.resolve(
      mockSearchResults.filter((item) =>
        item.Title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }
}
