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

export default function Customer() {
  const customers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'yahoo@gmail.com',
      phone: '123-456-7890',
      totalAmount: '$500',
      membership: 'Gold',
      dateOfPurchase: '2025-04-01',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'yahoo@gmail.com',
      phone: '123-456-7890',
      totalAmount: '$300',
      membership: 'Silver',
      dateOfPurchase: '2025-04-05',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'yahoo@gmail.com',
      phone: '123-456-7890',
      totalAmount: '$700',
      membership: 'Platinum',
      dateOfPurchase: '2025-04-10',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
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

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setSelectedCustomer(null);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <input
            type="text"
            placeholder="Search customers..."
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
                  Customer ID
                </TableHead>
                <TableHead className="text-center text-white">
                  Customer Name
                </TableHead>
                <TableHead className="text-center text-white">Email</TableHead>
                <TableHead className="text-center text-white">Phone</TableHead>
                <TableHead className="text-center text-white">
                  Total Amount
                </TableHead>
                <TableHead className="text-center text-white">
                  Membership
                </TableHead>
                <TableHead className="text-center text-white">
                  Date of Purchase
                </TableHead>
                <TableHead className="text-center text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="text-center">{customer.id}</TableCell>
                  <TableCell className="text-center">{customer.name}</TableCell>
                  <TableCell className="text-center">
                    {customer.email}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.totalAmount}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.membership}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.dateOfPurchase}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleView(customer)}
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

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Customer Details' : 'View Customer Details'}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Customer ID</label>
                <input
                  type="text"
                  name="id"
                  value={selectedCustomer.id}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedCustomer.name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="text"
                  name="email"
                  value={selectedCustomer.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={selectedCustomer.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Total Amount
                </label>
                <input
                  type="text"
                  name="totalAmount"
                  value={selectedCustomer.totalAmount}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Membership</label>
                <input
                  type="text"
                  name="membership"
                  value={selectedCustomer.membership}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Date of Purchase
                </label>
                <input
                  type="text"
                  name="dateOfPurchase"
                  value={selectedCustomer.dateOfPurchase}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="flex justify-end space-x-2">
                {isEditing ? (
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleClose}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
