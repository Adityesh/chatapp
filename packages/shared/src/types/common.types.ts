export type SearchPaginationQuery = {
  page?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: {
    [column: string]: string | string[];
  };
  select?: string[];
  cursor?: string;
  cursorColumn?: string;
  cursorDirection?: 'before' | 'after';
  path: string;
}