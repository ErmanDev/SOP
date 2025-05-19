import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon } from 'lucide-react';
import { useState } from 'react';

export default function Sales() {
  const sales = [
    {
      id: 1,
      orderingDate: '2025-04-01',
      salesPerson: 'John Doe',
      totalItems: 50,
      totalAmount: '$1000 (10% tax)',
    },
    {
      id: 2,
      orderingDate: '2025-04-05',
      salesPerson: 'Jane Smith',
      totalItems: 20,
      totalAmount: '$500 (5% tax)',
    },
    {
      id: 3,
      orderingDate: '2025-04-10',
      salesPerson: 'Alice Johnson',
      totalItems: 40,
      totalAmount: '$800 (8% tax)',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter sales based on the search term
  const filteredSales = sales.filter((sale) =>
    sale.salesPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [selectedSale, setSelectedSale] = useState(null);

  const handleView = (sale) => {
    setSelectedSale(sale);
  };

  const handleClose = () => {
    setSelectedSale(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sales Management</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-80 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
              Create Sales
            </button>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-purple-600">
              <TableRow>
                <TableHead className="text-center text-white">
                  Order ID
                </TableHead>
                <TableHead className="text-center text-white">
                  Ordering Date
                </TableHead>
                <TableHead className="text-center text-white">
                  Sales Person
                </TableHead>
                <TableHead className="text-center text-white">
                  Total Items
                </TableHead>
                <TableHead className="text-center text-white">
                  Total Amount
                </TableHead>
                <TableHead className="text-center text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="text-center">{sale.id}</TableCell>
                  <TableCell className="text-center">
                    {sale.orderingDate}
                  </TableCell>
                  <TableCell className="text-center">
                    {sale.salesPerson}
                  </TableCell>
                  <TableCell className="text-center">
                    {sale.totalItems}
                  </TableCell>
                  <TableCell className="text-center">
                    {sale.totalAmount}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleView(sale)}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
      </div>

      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">View Sale Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Order ID</label>
              <input
                type="text"
                value={selectedSale.id}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Ordering Date</label>
              <input
                type="text"
                value={selectedSale.orderingDate}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Sales Person</label>
              <input
                type="text"
                value={selectedSale.salesPerson}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Total Items</label>
              <input
                type="text"
                value={selectedSale.totalItems}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Total Amount</label>
              <input
                type="text"
                value={selectedSale.totalAmount}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
