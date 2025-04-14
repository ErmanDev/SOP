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

export default function Employees() {
  const employees = [
    {
      id: '000010',
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      dateHired: '2023-01-15',
      status: 'Full-time',
    },
    {
      id: '000011',
      name: 'Jane Smith',
      phone: '987-654-3210',
      email: 'jane.smith@example.com',
      dateHired: '2022-11-20',
      status: 'Part-time',
    },
    {
      id: '000012',
      name: 'Alice Johnson',
      phone: '555-123-4567',
      email: 'alice.johnson@example.com',
      dateHired: '2021-05-10',
      status: 'Full-time',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <input
            type="text"
            placeholder="Search employees..."
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
                  Employee ID
                </TableHead>
                <TableHead className="text-center text-white">
                  Employee Name
                </TableHead>
                <TableHead className="text-center text-white">Phone</TableHead>
                <TableHead className="text-center text-white">Email</TableHead>
                <TableHead className="text-center text-white">
                  Date Hired
                </TableHead>
                <TableHead className="text-center text-white">Status</TableHead>
                <TableHead className="text-center text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="text-center">{employee.id}</TableCell>
                  <TableCell className="text-center">{employee.name}</TableCell>
                  <TableCell className="text-center">
                    {employee.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {employee.email}
                  </TableCell>
                  <TableCell className="text-center">
                    {employee.dateHired}
                  </TableCell>
                  <TableCell className="text-center">
                    {employee.status}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleView(employee)}
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

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Employee Details' : 'View Employee Details'}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Employee ID</label>
                <input
                  type="text"
                  name="id"
                  value={selectedEmployee.id}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedEmployee.name}
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
                  value={selectedEmployee.phone}
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
                  type="email"
                  name="email"
                  value={selectedEmployee.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Date Hired</label>
                <input
                  type="text"
                  name="dateHired"
                  value={selectedEmployee.dateHired}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <input
                  type="text"
                  name="status"
                  value={selectedEmployee.status}
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
