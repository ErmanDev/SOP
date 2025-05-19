import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';

interface ApiEmployee {
  user_id: string;
  full_name: string;
  status: string;
}

interface Employee {
  id: string;
  name: string;
  status: string;
  position?: string;
}

interface PayrollEntry {
  id: string;
  name: string;
  position: string;
  status: string;
  salary: number;
}

interface NewPayroll {
  employeeId: string;
  position: string;
  salary: string;
}

// Add positions array
const POSITIONS = [
  'Store Manager',
  'Assistant Manager',
  'Cashier',
  'Sales Associate',
  'Customer Service Representative',
] as const;

export default function Payroll() {
  const [payrolls, setPayrolls] = useState<PayrollEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollEntry | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [newPayroll, setNewPayroll] = useState<NewPayroll>({
    employeeId: '',
    position: '',
    salary: '',
  });

  const itemsPerPage = 5;

  // Fetch both employees and payrolls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch employees first
        const employeeResponse = await fetch(
          'http://localhost:5000/api/users/getEmployee'
        );
        if (!employeeResponse.ok) {
          throw new Error('Failed to fetch employees');
        }
        const employeeData = await employeeResponse.json();
        const formattedEmployees = employeeData.map((emp: ApiEmployee) => ({
          id: emp.user_id,
          name: emp.full_name,
          status: emp.status,
        }));
        setEmployees(formattedEmployees);

        // Then fetch payrolls
        const payrollResponse = await fetch(
          'http://localhost:5000/api/payrolls'
        );
        if (payrollResponse.ok) {
          const payrollData = await payrollResponse.json();
          setPayrolls(payrollData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPayrolls([]);
        toast.error('Failed to load some data. Showing available information.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (isEditing && selectedPayroll) {
      if (name !== 'status') {
        setSelectedPayroll({ ...selectedPayroll, [name]: value });
      }
    } else {
      setNewPayroll({ ...newPayroll, [name]: value });

      if (name === 'employeeId') {
        const selectedEmployee = employees.find((emp) => emp.id === value);
        if (selectedEmployee) {
          setNewPayroll((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      }
    }
  };

  const handleCreatePayroll = async () => {
    try {
      // Find the selected employee
      const selectedEmployee = employees.find(
        (emp) => emp.id === newPayroll.employeeId
      );
      if (!selectedEmployee) {
        toast.error('Please select a valid employee');
        return;
      }

      // Check if employee already exists in payrolls
      const employeeExists = payrolls.some(
        (payroll) => payroll.name === selectedEmployee.name
      );

      if (employeeExists) {
        toast.error('This employee already has a payroll entry');
        return;
      }

      // Validate salary
      const salary = parseFloat(newPayroll.salary);
      if (isNaN(salary) || salary < 0) {
        toast.error('Please enter a valid salary amount');
        return;
      }

      // Validate position
      if (!newPayroll.position.trim()) {
        toast.error('Please select a position');
        return;
      }

      const payrollData = {
        name: selectedEmployee.name,
        position: newPayroll.position.trim(),
        status: selectedEmployee.status,
        salary: salary,
      };

      console.log('Sending payroll data:', payrollData);

      const response = await fetch('http://localhost:5000/api/payrolls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payrollData),
      });

      const responseText = await response.text();
      console.log('Server response:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            errorData.message || 'Failed to create payroll entry'
          );
        } catch {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }

      const data = JSON.parse(responseText);
      setPayrolls([data.payroll, ...payrolls]);
      setIsAdding(false);
      setNewPayroll({
        employeeId: '',
        position: '',
        salary: '',
      });
      toast.success('Payroll entry created successfully');
    } catch (error) {
      console.error('Error creating payroll:', error);
      console.error('Full error details:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create payroll entry'
      );
    }
  };

  const handleEditPayroll = async () => {
    if (!selectedPayroll) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/payrolls/${selectedPayroll.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedPayroll),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update payroll entry');
      }

      const data = await response.json();
      setPayrolls(
        payrolls.map((p) => (p.id === selectedPayroll.id ? data.payroll : p))
      );
      setIsEditing(false);
      setSelectedPayroll(null);
      toast.success('Payroll entry updated successfully');
    } catch (error) {
      console.error('Error updating payroll:', error);
      toast.error('Failed to update payroll entry');
    }
  };

  const handleDeletePayroll = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payrolls/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete payroll entry');
      }

      setPayrolls(payrolls.filter((p) => p.id !== id));
      setDeleteDialogOpen(null);
      toast.success('Payroll entry deleted successfully');
    } catch (error) {
      console.error('Error deleting payroll:', error);
      toast.error('Failed to delete payroll entry');
    }
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
      <div className="container mx-auto p-4">
        <div className="border rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Payroll Management</h1>
            <div className="animate-pulse bg-gray-200 h-10 w-96 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 h-12 w-full rounded"></div>
            <div className="animate-pulse bg-gray-200 h-12 w-full rounded"></div>
            <div className="animate-pulse bg-gray-200 h-12 w-full rounded"></div>
          </div>
        </div>
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
            <button
              onClick={() => setIsAdding(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
            >
              Create Payroll
            </button>
          </div>
        </div>

        {payrolls.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No payroll entries found</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Create Payroll" to add a new entry
            </p>
          </div>
        ) : (
          <>
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
                    <TableHead className="text-center text-white">
                      Status
                    </TableHead>
                    <TableHead className="text-center text-white">
                      Salary
                    </TableHead>
                    <TableHead className="text-center text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayrolls.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-center">{entry.id}</TableCell>
                      <TableCell className="text-center">
                        {entry.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.position}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.status}
                      </TableCell>
                      <TableCell className="text-center">
                        ₱{entry.salary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPayroll(entry);
                              setIsEditing(true);
                            }}
                            className="p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteDialogOpen(entry.id)}
                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
          </>
        )}
      </div>

      {/* Create Payroll Dialog */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
            <h2 className="text-xl font-bold mb-4">Create New Payroll Entry</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Employee
                </label>
                <select
                  name="employeeId"
                  value={newPayroll.employeeId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.status})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <input
                  type="text"
                  value={
                    employees.find((emp) => emp.id === newPayroll.employeeId)
                      ?.status || ''
                  }
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <select
                  name="position"
                  value={newPayroll.position}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select a position</option>
                  {POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={newPayroll.salary}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePayroll}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payroll Dialog */}
      {isEditing && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
            <h2 className="text-xl font-bold mb-4">Edit Payroll Entry</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={selectedPayroll.id}
                  disabled
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={selectedPayroll.name}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <input
                  type="text"
                  name="status"
                  value={
                    employees.find((emp) => emp.name === selectedPayroll.name)
                      ?.status || selectedPayroll.status
                  }
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <select
                  name="position"
                  value={selectedPayroll.position}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border rounded px-3 py-2 ${
                    isEditing ? '' : 'bg-gray-100'
                  }`}
                >
                  {POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={selectedPayroll.salary}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedPayroll(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPayroll}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payroll Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payroll entry? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialogOpen && handleDeletePayroll(deleteDialogOpen)
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
