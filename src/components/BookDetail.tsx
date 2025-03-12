
import { Book } from "@/types/book";
import { 
  BookCopy, 
  Calendar, 
  Hash, 
  Book as BookIcon,
  Building, 
  Clock, 
  TextQuote,
  LogOut,
  User,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  onEdit: (book: Book) => void;
}

export const BookDetail = ({ book, onClose, onEdit }: BookDetailProps) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{book.title}</h2>
          {book.checkedOut?.isCheckedOut && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <LogOut className="h-3 w-3 mr-1" />
              Checked Out
            </span>
          )}
        </div>
        <p className="text-muted-foreground">{book.author}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {book.coverUrl && (
          <div className="sm:col-span-2 flex justify-center">
            <div className="relative h-64 max-w-[200px] overflow-hidden rounded-md shadow-md transition-all hover:shadow-lg">
              <img 
                src={book.coverUrl} 
                alt={`Cover of ${book.title}`}
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Handle image load errors
                  (e.target as HTMLImageElement).style.display = 'none';
                }} 
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Book Details</h3>
            <Separator />
            
            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="flex items-start gap-3">
                <BookIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="text-sm">{book.title}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <BookCopy className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Author</p>
                  <p className="text-sm">{book.author}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Publisher</p>
                  <p className="text-sm">{book.publisher}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
            <Separator />
            
            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Published Date</p>
                  <p className="text-sm">{formatDate(book.publishedDate)}</p>
                </div>
              </div>
              
              {book.isbn && (
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">ISBN</p>
                    <p className="text-sm">{book.isbn}</p>
                  </div>
                </div>
              )}
              
              {book.genre && (
                <div className="flex items-start gap-3">
                  <BookIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Genre</p>
                    <p className="text-sm">{book.genre}</p>
                  </div>
                </div>
              )}
              
              {book.pageCount && (
                <div className="flex items-start gap-3">
                  <TextQuote className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pages</p>
                    <p className="text-sm">{book.pageCount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {book.checkedOut?.isCheckedOut && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Checkout Information</h3>
          <Separator />
          <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-3 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Borrower</p>
                  <p className="text-sm">{book.checkedOut.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{book.checkedOut.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:col-span-2">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Checkout Date</p>
                  <p className="text-sm">{formatDate(book.checkedOut.checkoutDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {book.description && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
          <Separator />
          <p className="text-sm whitespace-pre-line">{book.description}</p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Record Information</h3>
        <Separator />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Added: {formatDate(book.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated: {formatDate(book.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => onEdit(book)}>
          Edit Book
        </Button>
      </div>
    </div>
  );
};
