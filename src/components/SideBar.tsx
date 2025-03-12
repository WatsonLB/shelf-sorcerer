
import { useState, useEffect } from "react";
import { Book, PlusCircle, LineChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  const navigateTo = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
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
              active={location.pathname === '/'} 
              onClick={() => navigateTo('/')}
            />
            <NavItem 
              icon={LineChart} 
              title="Statistics" 
              active={location.pathname === '/statistics'} 
              onClick={() => navigateTo('/statistics')}
            />
            <NavItem 
              icon={Settings} 
              title="Settings" 
              active={location.pathname === '/settings'} 
              onClick={() => navigateTo('/settings')}
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
