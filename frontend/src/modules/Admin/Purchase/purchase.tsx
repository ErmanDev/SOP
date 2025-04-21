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

export default function Purchase() {
  const purchases = [
    {
      id: 1,
      totalProducts: 10,
      totalQuantity: 50,
      totalAmount: '$1000',
      salesPerson: 'John Doe',
      phone: '123-456-7890',
      status: 'Pending',
    },
    {
      id: 2,
      totalProducts: 5,
      totalQuantity: 20,
      totalAmount: '$500',
      salesPerson: 'Jane Smith',
      phone: '987-654-3210',
      status: 'Delivered',
    },
    {
      id: 3,
      totalProducts: 8,
      totalQuantity: 40,
      totalAmount: '$800',
      salesPerson: 'Alice Johnson',
      phone: '456-789-1234',
      status: 'Pending',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter purchases based on the search term
  const filteredPurchases = purchases.filter((purchase) =>
    purchase.salesPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const paginatedPurchases = filteredPurchases.slice(
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

  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleView = (purchase) => {
    setSelectedPurchase(purchase);
  };

  const handleClose = () => {
    setSelectedPurchase(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Purchase Management</h1>
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-80 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          />
        </div>

        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-purple-600">
              <TableRow>
                <TableHead className="text-center text-white">
                  Purchase ID
                </TableHead>
                <TableHead className="text-center text-white">
                  Total Products
                </TableHead>
                <TableHead className="text-center text-white">
                  Total Quantity
                </TableHead>
                <TableHead className="text-center text-white">
                  Total Amount
                </TableHead>
                <TableHead className="text-center text-white">
                  Sales Person
                </TableHead>
                <TableHead className="text-center text-white">Phone</TableHead>
                <TableHead className="text-center text-white">Status</TableHead>
                <TableHead className="text-center text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="text-center">{purchase.id}</TableCell>
                  <TableCell className="text-center">
                    {purchase.totalProducts}
                  </TableCell>
                  <TableCell className="text-center">
                    {purchase.totalQuantity}
                  </TableCell>
                  <TableCell className="text-center">
                    {purchase.totalAmount}
                  </TableCell>
                  <TableCell className="text-center">
                    {purchase.salesPerson}
                  </TableCell>
                  <TableCell className="text-center">
                    {purchase.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {purchase.status}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleView(purchase)}
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

      {selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">View Purchase Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Purchase ID</label>
              <input
                type="text"
                value={selectedPurchase.id}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Total Products
              </label>
              <input
                type="text"
                value={selectedPurchase.totalProducts}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Total Quantity
              </label>
              <input
                type="text"
                value={selectedPurchase.totalQuantity}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Total Amount</label>
              <input
                type="text"
                value={selectedPurchase.totalAmount}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Sales Person</label>
              <input
                type="text"
                value={selectedPurchase.salesPerson}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                value={selectedPurchase.phone}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Status</label>
              <input
                type="text"
                value={selectedPurchase.status}
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
