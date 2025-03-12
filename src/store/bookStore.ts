
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Book, BookSortOptions, SortField } from '../types/book';

interface BookState {
  books: Book[];
  sortOptions: BookSortOptions;
  filteredBooks: Book[];
  searchQuery: string;
  
  // Actions
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBook: (id: string, bookData: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  setSortOptions: (options: BookSortOptions) => void;
  setSearchQuery: (query: string) => void;
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: [],
      sortOptions: { field: 'title', direction: 'asc' },
      filteredBooks: [],
      searchQuery: '',

      addBook: (bookData) => {
        const now = new Date().toISOString();
        const newBook: Book = {
          id: uuidv4(),
          ...bookData,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          const updatedBooks = [...state.books, newBook];
          return {
            books: updatedBooks,
            filteredBooks: filterAndSortBooks(updatedBooks, state.searchQuery, state.sortOptions),
          };
        });
      },

      updateBook: (id, bookData) => {
        set((state) => {
          const updatedBooks = state.books.map((book) => 
            book.id === id
              ? { ...book, ...bookData, updatedAt: new Date().toISOString() }
              : book
          );
          
          return {
            books: updatedBooks,
            filteredBooks: filterAndSortBooks(updatedBooks, state.searchQuery, state.sortOptions),
          };
        });
      },

      deleteBook: (id) => {
        set((state) => {
          const updatedBooks = state.books.filter((book) => book.id !== id);
          return {
            books: updatedBooks,
            filteredBooks: filterAndSortBooks(updatedBooks, state.searchQuery, state.sortOptions),
          };
        });
      },

      setSortOptions: (options) => {
        set((state) => {
          return {
            sortOptions: options,
            filteredBooks: filterAndSortBooks(state.books, state.searchQuery, options),
          };
        });
      },

      setSearchQuery: (query) => {
        set((state) => {
          return {
            searchQuery: query,
            filteredBooks: filterAndSortBooks(state.books, query, state.sortOptions),
          };
        });
      },
    }),
    {
      name: 'book-store',
    }
  )
);

function filterAndSortBooks(
  books: Book[],
  searchQuery: string,
  sortOptions: BookSortOptions
): Book[] {
  let result = [...books];
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.publisher.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query)
    );
  }
  
  // Apply sorting with proper type handling
  result.sort((a, b) => {
    const fieldA = String(a[sortOptions.field]); // Convert to string to handle all field types
    const fieldB = String(b[sortOptions.field]);
    
    if (sortOptions.field === 'publishedDate') {
      // Handle date comparison
      const dateA = new Date(fieldA).getTime();
      const dateB = new Date(fieldB).getTime();
      return sortOptions.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    const comparison = fieldA.localeCompare(fieldB);
    return sortOptions.direction === 'asc' ? comparison : -comparison;
  });
  
  return result;
}
