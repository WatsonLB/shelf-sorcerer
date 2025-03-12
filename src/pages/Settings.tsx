
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBookStore } from "@/store/bookStore";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { books } = useBookStore();
  const { toast } = useToast();

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

  return (
    <div className="p-6 max-w-2xl mx-auto">
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
    </div>
  );
};

export default Settings;
