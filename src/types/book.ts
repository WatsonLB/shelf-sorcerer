
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  genre?: string;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'title' | 'author' | 'publisher' | 'publishedDate';
export type SortDirection = 'asc' | 'desc';

export interface BookSortOptions {
  field: SortField;
  direction: SortDirection;
}
