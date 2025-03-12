
import { useState, useEffect, useMemo } from "react";
import { 
  ArrowDown, ArrowUp, BookOpen, Edit, MoreVertical, Trash2
} from "lucide-react";
import { Book, SortField, BookSortOptions } from "@/types/book";
import { useBookStore } from "@/store/bookStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SortButtonProps {
  field: SortField;
  label: string;
  currentSort: BookSortOptions;
  onSort: (field: SortField) => void;
}

const SortButton = ({ field, label, currentSort, onSort }: SortButtonProps) => {
  const isActive = currentSort.field === field;
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "gap-1 px-2 h-8",
        isActive && "font-medium"
      )}
      onClick={() => onSort(field)}
    >
      {label}
      {isActive && (
        currentSort.direction === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )
      )}
    </Button>
  );
};

interface BookListProps {
  onEditBook: (book: Book) => void;
  onViewBook: (book: Book) => void;
}

export const BookList = ({ onEditBook, onViewBook }: BookListProps) => {
  const { books, filteredBooks, sortOptions, setSortOptions, deleteBook, searchQuery } = useBookStore();
  const [animateItems, setAnimateItems] = useState(false);

  // Sort books by the specified field
  const handleSort = (field: SortField) => {
    setSortOptions({
      field,
      direction: 
        sortOptions.field === field && sortOptions.direction === "asc" 
          ? "desc" 
          : "asc"
    });
  };

  // Delay animations to ensure they play after render
  useEffect(() => {
    setAnimateItems(false);
    const timer = setTimeout(() => setAnimateItems(true), 100);
    return () => clearTimeout(timer);
  }, [filteredBooks, sortOptions]);

  // Calculate display books: filtered if search is active, otherwise all books
  const displayBooks = useMemo(() => {
    return searchQuery ? filteredBooks : books;
  }, [books, filteredBooks, searchQuery]);

  // Format book date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Library ({displayBooks.length})</h2>
        
        {/* Sort buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <SortButton 
            field="title" 
            label="Title" 
            currentSort={sortOptions} 
            onSort={handleSort} 
          />
          <SortButton 
            field="author" 
            label="Author" 
            currentSort={sortOptions} 
            onSort={handleSort} 
          />
          <SortButton 
            field="publisher" 
            label="Publisher" 
            currentSort={sortOptions} 
            onSort={handleSort} 
          />
          <SortButton 
            field="publishedDate" 
            label="Date" 
            currentSort={sortOptions} 
            onSort={handleSort} 
          />
        </div>
      </div>

      {displayBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">No books found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try a different search term" : "Add your first book to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayBooks.map((book, index) => (
            <Card
              key={book.id}
              className={cn(
                "p-4 transition-all",
                animateItems && "animate-slide-up",
                !animateItems && "opacity-0"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => onViewBook(book)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{book.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {book.author}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{book.publisher}</span>
                    <span>•</span>
                    <span>{formatDate(book.publishedDate)}</span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onEditBook(book);
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBook(book.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
