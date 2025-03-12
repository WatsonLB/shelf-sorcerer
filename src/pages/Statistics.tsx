
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useBookStore } from '@/store/bookStore';
import { Card } from '@/components/ui/card';

const Statistics = () => {
  const { books } = useBookStore();

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

  return (
    <div className="p-6 space-y-6">
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
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Statistics;
