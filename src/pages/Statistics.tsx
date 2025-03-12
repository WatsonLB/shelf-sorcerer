
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { useBookStore } from '@/store/bookStore';
import { Card } from '@/components/ui/card';
import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { BookForm } from "@/components/BookForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Statistics = () => {
  const { books } = useBookStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Calculate statistics
  const totalBooks = books.length;
  const uniqueAuthors = new Set(books.map(book => book.author)).size;
  const uniquePublishers = new Set(books.map(book => book.publisher)).size;

  // Prepare data for publisher chart
  const publisherData = Object.entries(
    books.reduce((acc, book) => {
      acc[book.publisher] = (acc[book.publisher] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }));

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle add book
  const handleAddBook = () => {
    setIsAddDialogOpen(true);
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
        <h1 className="text-2xl font-bold mb-6">Library Statistics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Books</h3>
            <p className="text-2xl font-bold">{totalBooks}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Unique Authors</h3>
            <p className="text-2xl font-bold">{uniqueAuthors}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Publishers</h3>
            <p className="text-2xl font-bold">{uniquePublishers}</p>
          </Card>
        </div>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Books by Publisher</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={publisherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
    </div>
  );
};

export default Statistics;
