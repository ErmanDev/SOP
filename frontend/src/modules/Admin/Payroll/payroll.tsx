import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';

interface PayrollEntry {
  id: string;
  name: string;
  position: string;
  status: string;
  salary: number;
}

export default function Payroll() {
  const [payrolls, setPayrolls] = useState<PayrollEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Replace this with your actual API call
    const fetchPayrolls = async () => {
      try {
        setLoading(true);
        // Example static data, replace with API call
        const data: PayrollEntry[] = [
          {
            id: 'EMP001',
            name: 'John Doe',
            position: 'Cashier',
            status: 'Full-Time',
            salary: 30000,
          },
          {
            id: 'EMP002',
            name: 'Jane Smith',
            position: 'Manager',
            status: 'Part-Time',
            salary: 20000,
          },
        ];
        setPayrolls(data);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        setError('Failed to load payroll data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPayrolls = payrolls.filter(
    (entry) =>
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const paginatedPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading payroll data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payroll Management</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search payroll..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-80 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
              Create Payroll
            </button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-purple-600">
              <TableRow>
                <TableHead className="text-center text-white">
                  Employee ID
                </TableHead>
                <TableHead className="text-center text-white">
                  Employee Name
                </TableHead>
                <TableHead className="text-center text-white">
                  Position
                </TableHead>
                <TableHead className="text-center text-white">Status</TableHead>
                <TableHead className="text-center text-white">Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayrolls.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-center">{entry.id}</TableCell>
                  <TableCell className="text-center">{entry.name}</TableCell>
                  <TableCell className="text-center">
                    {entry.position}
                  </TableCell>
                  <TableCell className="text-center">{entry.status}</TableCell>
                  <TableCell className="text-center">
                    ₱{entry.salary.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 0 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
