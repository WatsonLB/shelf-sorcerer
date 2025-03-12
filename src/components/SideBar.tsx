
import { useState, useEffect } from "react";
import { Book, PlusCircle, LineChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ElementType;
  title: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, title, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors text-sm font-medium",
      active 
        ? "bg-primary text-primary-foreground" 
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    )}
  >
    <Icon className="h-4 w-4" />
    <span>{title}</span>
  </button>
);

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: () => void;
}

export const SideBar = ({ isOpen, onClose, onAddBook }: SideBarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("books");

  // Handle screen size changes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobile && isOpen && sidebar && !sidebar.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r p-4 transition-transform duration-300 ease-in-out",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="py-4">
            <h2 className="text-xl font-medium px-3">Shelf</h2>
          </div>
          
          <div className="space-y-1 mt-2">
            <NavItem 
              icon={Book} 
              title="Books" 
              active={activeView === "books"} 
              onClick={() => setActiveView("books")}
            />
            <NavItem 
              icon={LineChart} 
              title="Statistics" 
              active={activeView === "statistics"} 
              onClick={() => setActiveView("statistics")}
            />
            <NavItem 
              icon={Settings} 
              title="Settings" 
              active={activeView === "settings"} 
              onClick={() => setActiveView("settings")}
            />
          </div>
          
          <div className="mt-auto">
            <Button 
              onClick={onAddBook}
              className="w-full justify-start gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Book
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
