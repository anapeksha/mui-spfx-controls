jest.mock('../../src/config/pnp.config', () =>
  jest.requireActual('../mocks/pnp.config')
);

import { SearchResults } from '@pnp/sp/search';
import { SearchService } from '../../src/services/SearchService';
import { mockedContext } from '../mocks/context';
import { getSp } from '../mocks/pnp.config';

describe('SearchService', () => {
  let service: SearchService;
  let mockSp: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SearchService(mockedContext);
    mockSp = getSp();
  });

  describe('search', () => {
    it('should execute search query with default options', async () => {
      const mockResults: SearchResults = {
        PrimarySearchResults: [
          {
            Title: 'Document 1',
            Path: '/sites/test/doc1.docx',
            Author: 'John Doe',
          },
          {
            Title: 'Document 2',
            Path: '/sites/test/doc2.pdf',
            Author: 'Jane Smith',
          },
        ],
        TotalRows: 2,
        RowCount: 2,
      } as SearchResults;

      mockSp.search.mockResolvedValue(mockResults);

      const result = await service.search('test query', 10);

      expect(mockSp.search).toHaveBeenCalledWith({
        QueryTemplate: 'test query',
        RowLimit: 10,
        EnableInterleaving: true,
        TrimDuplicates: true,
      });
      expect(result.PrimarySearchResults).toHaveLength(2);
      expect(result.TotalRows).toBe(2);
    });

    it('should handle search with different row limits', async () => {
      const mockResults: SearchResults = {
        PrimarySearchResults: [],
        TotalRows: 0,
        RowCount: 0,
      } as unknown as SearchResults;

      mockSp.search.mockResolvedValue(mockResults);

      await service.search('another query', 50);

      expect(mockSp.search).toHaveBeenCalledWith({
        QueryTemplate: 'another query',
        RowLimit: 50,
        EnableInterleaving: true,
        TrimDuplicates: true,
      });
    });

    it('should return empty results when no matches found', async () => {
      const mockResults: SearchResults = {
        PrimarySearchResults: [],
        TotalRows: 0,
        RowCount: 0,
      } as unknown as SearchResults;

      mockSp.search.mockResolvedValue(mockResults);

      const result = await service.search('nonexistent', 10);

      expect(result.PrimarySearchResults).toEqual([]);
      expect(result.TotalRows).toBe(0);
    });

    it('should handle complex search queries', async () => {
      const complexQuery =
        'contentclass:STS_ListItem AND FileType:docx AND Author:"John Doe"';
      const mockResults: SearchResults = {
        PrimarySearchResults: [
          {
            Title: 'Filtered Document',
            Path: '/sites/test/filtered.docx',
            Author: 'John Doe',
          },
        ],
        TotalRows: 1,
        RowCount: 1,
      } as SearchResults;

      mockSp.search.mockResolvedValue(mockResults);

      const result = await service.search(complexQuery, 100);

      expect(mockSp.search).toHaveBeenCalledWith({
        QueryTemplate: complexQuery,
        RowLimit: 100,
        EnableInterleaving: true,
        TrimDuplicates: true,
      });
      expect(result.PrimarySearchResults).toHaveLength(1);
    });

    it('should handle large result sets', async () => {
      const largeResults = Array.from({ length: 500 }, (_, i) => ({
        Title: `Document ${i + 1}`,
        Path: `/sites/test/doc${i + 1}.docx`,
      }));

      const mockResults: SearchResults = {
        PrimarySearchResults: largeResults,
        TotalRows: 500,
        RowCount: 500,
      } as SearchResults;

      mockSp.search.mockResolvedValue(mockResults);

      const result = await service.search('*', 500);

      expect(result.PrimarySearchResults).toHaveLength(500);
      expect(result.TotalRows).toBe(500);
    });

    it('should pass EnableInterleaving and TrimDuplicates flags', async () => {
      mockSp.search.mockResolvedValue({
        PrimarySearchResults: [],
        TotalRows: 0,
      } as unknown as SearchResults);

      await service.search('test', 25);

      const callArgs = mockSp.search.mock.calls[0][0];
      expect(callArgs.EnableInterleaving).toBe(true);
      expect(callArgs.TrimDuplicates).toBe(true);
    });
  });
});
