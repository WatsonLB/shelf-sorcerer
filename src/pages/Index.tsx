
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { BookList } from "@/components/BookList";
import { BookForm } from "@/components/BookForm";
import { BookDetail } from "@/components/BookDetail";
import { Book } from "@/types/book";
import { useBookStore } from "@/store/bookStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { books } = useBookStore();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on wider screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle book actions
  const handleAddBook = () => {
    setSelectedBook(null);
    setIsAddDialogOpen(true);
  };
  
  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
    setIsViewDialogOpen(true);
  };
  
  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={toggleSidebar} />
      <SideBar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onAddBook={handleAddBook}
      />
      
      <main className="pt-20 px-4 pb-8 md:px-6 max-w-7xl mx-auto md:ml-64">
        <BookList 
          onEditBook={handleEditBook}
          onViewBook={handleViewBook}
        />
        
        {books.length === 0 && (
          <div className="mt-6 p-6 border rounded-lg border-dashed flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-medium mb-2">Welcome to your shelf</h3>
            <p className="text-muted-foreground mb-4">Start building your personal library by adding your first book</p>
            <button
              onClick={handleAddBook}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Add Your First Book
            </button>
          </div>
        )}
      </main>
      
      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <BookForm 
            onClose={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <BookForm 
              book={selectedBook} 
              onClose={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Book Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBook && (
            <BookDetail 
              book={selectedBook} 
              onClose={() => setIsViewDialogOpen(false)}
              onEdit={handleEditBook}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
