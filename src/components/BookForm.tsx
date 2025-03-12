
import { useState, useEffect } from "react";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBookStore } from "@/store/bookStore";
import { toast } from "sonner";

interface BookFormProps {
  book?: Book;
  onClose: () => void;
}

export const BookForm = ({ book, onClose }: BookFormProps) => {
  const { addBook, updateBook } = useBookStore();
  const isEditing = !!book;

  // Create empty book with default values
  const defaultBook = {
    title: "",
    author: "",
    publisher: "",
    publishedDate: new Date().toISOString().split('T')[0],
    isbn: "",
    description: "",
    genre: "",
    pageCount: undefined,
  };

  const [formData, setFormData] = useState<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>(
    isEditing 
      ? { ...book, publishedDate: new Date(book.publishedDate).toISOString().split('T')[0] }
      : defaultBook
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when the book prop changes
  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        publishedDate: new Date(book.publishedDate).toISOString().split('T')[0],
        pageCount: book.pageCount || undefined
      });
    } else {
      setFormData(defaultBook);
    }
  }, [book]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }
    
    if (!formData.publisher.trim()) {
      newErrors.publisher = "Publisher is required";
    }
    
    if (!formData.publishedDate) {
      newErrors.publishedDate = "Publication date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing && book) {
        updateBook(book.id, formData);
        toast.success("Book updated successfully");
      } else {
        addBook(formData);
        toast.success("Book added successfully");
      }
      onClose();
    } catch (error) {
      toast.error("An error occurred while saving the book");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title<span className="text-destructive">*</span></Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author<span className="text-destructive">*</span></Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            aria-invalid={!!errors.author}
          />
          {errors.author && (
            <p className="text-sm text-destructive">{errors.author}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher<span className="text-destructive">*</span></Label>
          <Input
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Enter publisher"
            aria-invalid={!!errors.publisher}
          />
          {errors.publisher && (
            <p className="text-sm text-destructive">{errors.publisher}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="publishedDate">Publication Date<span className="text-destructive">*</span></Label>
          <Input
            id="publishedDate"
            name="publishedDate"
            type="date"
            value={formData.publishedDate}
            onChange={handleChange}
            placeholder="Select publication date"
            aria-invalid={!!errors.publishedDate}
          />
          {errors.publishedDate && (
            <p className="text-sm text-destructive">{errors.publishedDate}</p>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            name="isbn"
            value={formData.isbn || ""}
            onChange={handleChange}
            placeholder="Enter ISBN (optional)"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input
            id="genre"
            name="genre"
            value={formData.genre || ""}
            onChange={handleChange}
            placeholder="Enter genre (optional)"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pageCount">Page Count</Label>
          <Input
            id="pageCount"
            name="pageCount"
            type="number"
            value={formData.pageCount !== undefined ? formData.pageCount : ""}
            onChange={handleChange}
            placeholder="Enter page count (optional)"
            min="1"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coverUrl">Cover Image URL</Label>
          <Input
            id="coverUrl"
            name="coverUrl"
            value={formData.coverUrl || ""}
            onChange={handleChange}
            placeholder="Enter cover image URL (optional)"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Enter book description (optional)"
          rows={4}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update Book" : "Add Book"}
        </Button>
      </div>
    </form>
  );
};
