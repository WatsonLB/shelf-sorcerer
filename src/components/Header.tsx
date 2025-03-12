
import { useState, useEffect } from "react";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookStore } from "@/store/bookStore";

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const setSearchQuery = useBookStore((state) => state.setSearchQuery);

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchQuery(value);
  };

  // Toggle search visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchValue("");
      setSearchQuery("");
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 px-4 md:px-6 transition-all duration-200 ${
        isScrolled 
          ? "py-3 bg-background/80 backdrop-blur-lg border-b" 
          : "py-4 bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium tracking-tight">Shelf</h1>
        </div>

        <div className="flex items-center gap-2">
          <div 
            className={`relative transition-all duration-300 ease-in-out overflow-hidden ${
              isSearchVisible ? "w-full md:w-64 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <Input
              type="text"
              placeholder="Search books..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-3 pr-8"
            />
            {searchValue && (
              <button 
                onClick={() => {
                  setSearchValue("");
                  setSearchQuery("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSearch}
            className="flex-shrink-0"
          >
            {isSearchVisible ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
