
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBookStore } from "@/store/bookStore";
import { Download, LogIn, LogOut, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { BookForm } from "@/components/BookForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book } from "@/types/book";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { books, checkoutBook, checkinBook } = useBookStore();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");

  const handleExport = () => {
    const data = JSON.stringify(books, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'library-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "Your library data has been exported successfully."
    });
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle add book
  const handleAddBook = () => {
    setIsAddDialogOpen(true);
  };

  // Handle checkout dialog
  const openCheckoutDialog = () => {
    setSearchQuery("");
    setFilteredBooks([]);
    setSelectedBook(null);
    setCheckoutName("");
    setCheckoutPhone("");
    setIsCheckoutDialogOpen(true);
  };

  // Handle search for checkout
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredBooks([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = books.filter(
      book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
    );
    
    setFilteredBooks(results);
  };

  // Handle book selection for checkout
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  // Handle checkout submission
  const handleCheckout = () => {
    if (!selectedBook) {
      toast({
        title: "Error",
        description: "Please select a book to check out.",
        variant: "destructive"
      });
      return;
    }

    if (!checkoutName.trim()) {
      toast({
        title: "Error",
        description: "Please enter the name of the borrower.",
        variant: "destructive"
      });
      return;
    }

    if (!checkoutPhone.trim()) {
      toast({
        title: "Error",
        description: "Please enter the phone number of the borrower.",
        variant: "destructive"
      });
      return;
    }

    checkoutBook(selectedBook.id, checkoutName, checkoutPhone);
    
    toast({
      title: "Book Checked Out",
      description: `"${selectedBook.title}" has been checked out to ${checkoutName}.`
    });
    
    setIsCheckoutDialogOpen(false);
  };

  // Handle check in
  const handleCheckin = (book: Book) => {
    checkinBook(book.id);
    
    toast({
      title: "Book Checked In",
      description: `"${book.title}" has been returned to the library.`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={toggleSidebar} />
      <SideBar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onAddBook={handleAddBook}
      />
      
      <main className="pt-20 px-4 pb-8 md:px-6 max-w-2xl mx-auto md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Card className="p-6 space-y-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Data Management</h2>
            <p className="text-muted-foreground mb-4">
              Export your library data for backup or transfer to another device.
            </p>
            
            <div className="flex flex-col gap-4">
              <div>
                <Button onClick={handleExport} className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export Library Data
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Checkout Management</h2>
            <p className="text-muted-foreground mb-4">
              Check books in and out of your library.
            </p>
            
            <div className="flex flex-col gap-4">
              <div>
                <Button onClick={openCheckoutDialog} className="w-full sm:w-auto">
                  <LogOut className="mr-2 h-4 w-4" />
                  Check Out Book
                </Button>
              </div>
            </div>
          </div>

          {books.some(book => book.checkedOut?.isCheckedOut) && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-3">Currently Checked Out Books</h3>
              <div className="space-y-4">
                {books
                  .filter(book => book.checkedOut?.isCheckedOut)
                  .map(book => (
                    <div key={book.id} className="bg-accent/50 p-4 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                          <div className="mt-2 text-sm">
                            <p>Borrowed by: {book.checkedOut?.name}</p>
                            <p>Phone: {book.checkedOut?.phone}</p>
                            <p>Date: {new Date(book.checkedOut?.checkoutDate || '').toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCheckin(book)}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Check In
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Card>
      </main>
      
      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <BookForm onClose={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Check Out Book</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            {/* Search bar */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search for a book by title or author"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Search results */}
            {filteredBooks.length > 0 && (
              <div className="max-h-48 overflow-y-auto border rounded-md">
                {filteredBooks.map(book => (
                  <div 
                    key={book.id}
                    className={`p-3 cursor-pointer hover:bg-accent/50 ${selectedBook?.id === book.id ? 'bg-accent/50' : ''} 
                              ${book.checkedOut?.isCheckedOut ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => !book.checkedOut?.isCheckedOut && handleSelectBook(book)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                      </div>
                      {book.checkedOut?.isCheckedOut && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Checked Out
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredBooks.length === 0 && searchQuery.trim() !== "" && (
              <p className="text-sm text-muted-foreground">No books found with that title or author.</p>
            )}

            {/* Selected book */}
            {selectedBook && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Selected Book</h3>
                <div className="bg-accent/50 p-3 rounded-md">
                  <h4 className="font-medium">{selectedBook.title}</h4>
                  <p className="text-sm text-muted-foreground">by {selectedBook.author}</p>
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Borrower information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Borrower Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCheckout}>
                <LogOut className="mr-2 h-4 w-4" />
                Check Out Book
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
