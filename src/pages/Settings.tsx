
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBookStore } from "@/store/bookStore";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { BookForm } from "@/components/BookForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Settings = () => {
  const { books } = useBookStore();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
        
        <Card className="p-6 space-y-6">
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

export default Settings;
