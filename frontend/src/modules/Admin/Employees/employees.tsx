import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define interfaces for your data types
interface ApiEmployee {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  date_hired: string;
  profile_url: string;
}

interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateHired: string;
  status: string;
  profile_url: string;
}

interface NewEmployee {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  profile_url: string;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original if there's an error
  }
};

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newEmployee, setNewEmployee] = useState<NewEmployee>({
    user_id: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    status: 'Full-Time',
    profile_url: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:5000/api/users/getEmployee'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = (await response.json()) as ApiEmployee[];

        const formattedData: Employee[] = data.map((employee) => ({
          id: employee.user_id,
          name: employee.full_name,
          phone: employee.phone,
          email: employee.email,
          dateHired: formatDate(employee.date_hired),
          status: employee.status,
          profile_url: employee.profile_url,
        }));

        setEmployees(formattedData);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
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

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setPreviewUrl(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'quickmart'); // Replace with your Cloudinary upload preset

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
        setSelectedEmployee((prev) =>
          prev ? { ...prev, profile_url: data.secure_url } : prev
        );
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSave = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/updateEmployee/${selectedEmployee.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: selectedEmployee.name,
            phone: selectedEmployee.phone,
            email: selectedEmployee.email,
            date_hired: selectedEmployee.dateHired,
            status: selectedEmployee.status,
            profile_url: previewUrl || selectedEmployee.profile_url,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = 'Failed to update employee';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      let updatedEmployee;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          updatedEmployee = await response.json();
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (parseError) {
        console.error('Error parsing success response:', parseError);
        throw new Error('Failed to parse server response');
      }

      // Update the local state with the edited employee
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === selectedEmployee.id
            ? {
                ...selectedEmployee,
                profile_url: updatedEmployee.employee.profile_url,
              }
            : emp
        )
      );

      toast.success('Employee updated successfully');
      handleClose();
    } catch (error: unknown) {
      console.error('Error saving employee:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update employee';
      toast.error(errorMessage);
    }
  };

  const handleAddEmployee = () => {
    setIsAdding(true);
    setNewEmployee({
      user_id: '',
      full_name: '',
      email: '',
      phone: '',
      password: '',
      status: 'Full-Time',
      profile_url: '',
    });
    setPreviewUrl(null);
  };

  const handleNewEmployeeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewEmployeeImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'quickmart'); // Replace with your Cloudinary upload preset

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
        setNewEmployee((prev) => ({
          ...prev,
          profile_url: data.secure_url,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSaveNewEmployee = async () => {
    try {
      const formData = new FormData();
      formData.append('user_id', newEmployee.user_id);
      formData.append('full_name', newEmployee.full_name);
      formData.append('email', newEmployee.email);
      formData.append('phone', newEmployee.phone);
      formData.append('password', newEmployee.password);
      formData.append('status', newEmployee.status);

      // If a file was selected, append it to FormData
      if (previewUrl) {
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          formData.append('profile_image', fileInput.files[0]);
        }
      }

      const response = await fetch(
        'http://localhost:5000/api/users/registerEmployee',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add employee');
      }

      // Refresh the employee list after adding a new employee
      const fetchResponse = await fetch(
        'http://localhost:5000/api/users/getEmployee'
      );
      if (fetchResponse.ok) {
        const newData = await fetchResponse.json();
        const formattedData: Employee[] = newData.map(
          (employee: ApiEmployee) => ({
            id: employee.user_id,
            name: employee.full_name,
            phone: employee.phone,
            email: employee.email,
            dateHired: formatDate(employee.date_hired),
            status: employee.status,
            profile_url: employee.profile_url,
          })
        );
        setEmployees(formattedData);
      }
      toast.success('Employee added successfully');
      setIsAdding(false);
    } catch (error: unknown) {
      console.error('Error adding employee:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add employee';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-80 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
            <button
              onClick={handleAddEmployee}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              type="button"
            >
              Register Employee
            </button>
          </div>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-8">No employees found</div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-purple-600">
                <TableRow>
                  <TableHead className="text-center text-white">
                    Employee ID
                  </TableHead>
                  <TableHead className="text-center text-white">
                    Profile
                  </TableHead>
                  <TableHead className="text-center text-white">
                    Employee Name
                  </TableHead>
                  <TableHead className="text-center text-white">
                    Phone
                  </TableHead>
                  <TableHead className="text-center text-white">
                    Email
                  </TableHead>
                  <TableHead className="text-center text-white">
                    Date Hired
                  </TableHead>
                  <TableHead className="text-center text-white">
                    Status
                  </TableHead>
                  <TableHead className="text-center text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="text-center">
                        {employee.id}
                      </TableCell>
                      <TableCell>
                        <img
                          src={
                            employee.profile_url.startsWith('http')
                              ? employee.profile_url
                              : `http://localhost:5000${employee.profile_url}`
                          }
                          alt={employee.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {employee.name}
                      </TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

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

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Employee Details' : 'View Employee Details'}
            </h2>
            <form>
              <div className="mb-4 flex flex-col items-center">
                <img
                  src={
                    previewUrl
                      ? previewUrl
                      : selectedEmployee.profile_url.startsWith('/uploads')
                      ? `http://localhost:5000${selectedEmployee.profile_url}`
                      : selectedEmployee.profile_url
                  }
                  alt={selectedEmployee.name}
                  className="w-24 h-24 rounded-full mb-2"
                />
                {isEditing && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-center">
                      Change Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
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
                    Employee ID
                  </label>
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
                  <label className="block text-sm font-medium">
                    Date Hired
                  </label>
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
                  <select
                    name="status"
                    value={selectedEmployee.status}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full border rounded px-3 py-2 ${
                      isEditing ? '' : 'bg-gray-100'
                    }`}
                  >
                    <option value="Full-Time">Full Time</option>
                    <option value="Part-Time">Part Time</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                {isEditing ? (
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleSave}
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

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Register Employee</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Employee ID</label>
                <input
                  type="text"
                  name="user_id"
                  value={newEmployee.user_id}
                  onChange={handleNewEmployeeChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={newEmployee.full_name}
                  onChange={handleNewEmployeeChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleNewEmployeeChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newEmployee.phone}
                  onChange={handleNewEmployeeChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newEmployee.password}
                  onChange={handleNewEmployeeChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={newEmployee.status}
                  onChange={handleNewEmployeeChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewEmployeeImageChange}
                  className="w-full border rounded px-3 py-2"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full mt-2 mx-auto"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleSaveNewEmployee}
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
    </div>
  );
}
