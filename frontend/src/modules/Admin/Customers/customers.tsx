import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalAmount: string;
  membership: 'Silver' | 'Gold' | 'Platinum';
  dateOfPurchase: string;
  image_url: string;
}

export default function Customer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    totalAmount: '',
    membership: 'Silver',
    dateOfPurchase: new Date().toISOString().split('T')[0],
    image_url: '',
  });

  const itemsPerPage = 5;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setIsAdding(true);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      totalAmount: '',
      membership: 'Silver',
      dateOfPurchase: new Date().toISOString().split('T')[0],
      image_url: '',
    });
  };

  const handleNewCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewCustomerImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'quickmart'); // Your Cloudinary upload preset

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dhoi760j1/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setPreviewUrl(data.secure_url);
        setNewCustomer((prev) => ({
          ...prev,
          image_url: data.secure_url,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSaveNewCustomer = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/customers/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomer),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      const savedCustomer = await response.json();
      setCustomers((prev) => [savedCustomer, ...prev]);
      setIsAdding(false);
      toast.success('Customer created successfully');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer');
    }
  };

  const handleUpdateCustomer = async (customer: Customer) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${customer.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customer),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      const updatedCustomer = await response.json();
      setCustomers((prev) =>
        prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      );
      setSelectedCustomer(null);
      setIsEditing(false);
      toast.success('Customer updated successfully');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    }
  };

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    if (isEditing && selectedCustomer) {
      handleUpdateCustomer(selectedCustomer);
    } else {
      setSelectedCustomer(null);
      setIsEditing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleEditCustomerImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'quickmart'); // Your Cloudinary upload preset

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dhoi760j1/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setSelectedCustomer((prev) =>
          prev ? { ...prev, image_url: data.secure_url } : prev
        );
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-80 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={handleAddCustomer}
              type="button"
            >
              Register Customer
            </button>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-purple-600">
              <TableRow>
                <TableHead className="text-center text-white">ID</TableHead>
                <TableHead className="text-center text-white">Image</TableHead>
                <TableHead className="text-center text-white">Name</TableHead>
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
                  <TableCell className="text-center">
                    <img
                      src={
                        customer.image_url || 'https://via.placeholder.com/40'
                      }
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover mx-auto"
                    />
                  </TableCell>
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
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        customer.membership === 'Platinum'
                          ? 'bg-purple-600'
                          : customer.membership === 'Gold'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`}
                    >
                      {customer.membership}
                    </span>
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

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Register Customer</h2>
            <form>
              <div className="mb-4 flex flex-col items-center">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Customer Preview"
                    className="w-24 h-24 rounded-full mb-2 object-cover"
                  />
                )}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-center">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewCustomerImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-purple-50 file:text-purple-700
                      hover:file:bg-purple-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Total Amount
                  </label>
                  <input
                    type="text"
                    name="totalAmount"
                    value={newCustomer.totalAmount}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Membership
                  </label>
                  <select
                    name="membership"
                    value={newCustomer.membership}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Date of Purchase
                  </label>
                  <input
                    type="date"
                    name="dateOfPurchase"
                    value={newCustomer.dateOfPurchase}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleSaveNewCustomer}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Customer Details' : 'View Customer Details'}
            </h2>
            <form>
              <div className="mb-4 flex flex-col items-center">
                <img
                  src={
                    selectedCustomer.image_url ||
                    'https://via.placeholder.com/96'
                  }
                  alt={selectedCustomer.name}
                  className="w-24 h-24 rounded-full mb-2 object-cover"
                />
                {isEditing && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-center">
                      Change Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditCustomerImageChange}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-50 file:text-purple-700
                        hover:file:bg-purple-100"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Customer ID
                  </label>
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
                    type="email"
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
                  <label className="block text-sm font-medium">
                    Membership
                  </label>
                  {isEditing ? (
                    <select
                      name="membership"
                      value={selectedCustomer.membership}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="membership"
                      value={selectedCustomer.membership}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Date of Purchase
                  </label>
                  <input
                    type={isEditing ? 'date' : 'text'}
                    name="dateOfPurchase"
                    value={selectedCustomer.dateOfPurchase}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full border rounded px-3 py-2 ${
                      isEditing ? '' : 'bg-gray-100'
                    }`}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
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
                  onClick={() => {
                    setSelectedCustomer(null);
                    setIsEditing(false);
                  }}
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
