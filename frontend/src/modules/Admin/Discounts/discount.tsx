import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from '../../../components/ui/input';
import { Table } from '../../../components/ui/table';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../../../components/ui/alert-dialog';

interface Discount {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  percentage: number;
  categories: string[];
}

export default function Discounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    type: 'occasional',
    startDate: '',
    endDate: '',
    percentage: 0,
    categories: ['all'] as string[],
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDiscountId, setEditDiscountId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);

  // Add available categories
  const availableCategories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Home Appliance', name: 'Home Appliance' },
    { id: 'Gadgets', name: 'Gadgets' },
    { id: 'Furnitures', name: 'Furnitures' },
    { id: 'Smart Home', name: 'Smart Home' },
  ];

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/discounts');

        if (!response.ok) {
          throw new Error('Failed to fetch discounts');
        }

        const data = await response.json();
        setDiscounts(data);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };

    fetchDiscounts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewDiscount((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewDiscount((prev) => ({
      ...prev,
      categories: selectedOptions,
    }));
  };

  const handleCreateDiscount = async () => {
    if (
      !newDiscount.name ||
      !newDiscount.type ||
      !newDiscount.startDate ||
      !newDiscount.endDate ||
      newDiscount.percentage === null ||
      newDiscount.percentage === undefined ||
      !newDiscount.categories.length
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const payload = {
        ...newDiscount,
        percentage: Number(newDiscount.percentage),
        startDate: new Date(newDiscount.startDate).toISOString(),
        endDate: new Date(newDiscount.endDate).toISOString(),
      };

      const response = await fetch(
        'http://localhost:5000/api/discounts/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Failed to create discount'
        );
      }

      setDiscounts((prev) => [data.discount, ...prev]);
      setNewDiscount({
        name: '',
        type: 'occasional',
        startDate: '',
        endDate: '',
        percentage: 0,
        categories: ['all'],
      });
      setIsAdding(false);

      toast.success(data.message || 'Discount created successfully!');

      const refreshResponse = await fetch(
        'http://localhost:5000/api/discounts'
      );
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setDiscounts(refreshedData);
      }
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create discount'
      );
    }
  };

  const handleEditDiscount = (discountId: number) => {
    const discountToEdit = discounts.find(
      (discount) => discount.id === discountId
    );
    if (discountToEdit) {
      // Format dates to YYYY-MM-DD
      const formatDate = (date: string) => {
        return new Date(date).toISOString().split('T')[0];
      };

      setNewDiscount({
        name: discountToEdit.name,
        type: discountToEdit.type,
        startDate: formatDate(discountToEdit.startDate),
        endDate: formatDate(discountToEdit.endDate),
        percentage: discountToEdit.percentage,
        categories: discountToEdit.categories || ['all'],
      });
      setEditDiscountId(discountId);
      setIsEditing(true);
    }
  };

  const handleSaveEditDiscount = async () => {
    if (!editDiscountId) return;
    try {
      // Format dates to YYYY-MM-DD
      const formatDate = (date: string) => {
        return new Date(date).toISOString().split('T')[0];
      };

      const payload = {
        ...newDiscount,
        percentage: Number(newDiscount.percentage),
        startDate: formatDate(newDiscount.startDate),
        endDate: formatDate(newDiscount.endDate),
        // Ensure categories is always an array
        categories: Array.isArray(newDiscount.categories)
          ? newDiscount.categories
          : [newDiscount.categories],
      };

      const response = await fetch(
        `http://localhost:5000/api/discounts/${editDiscountId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update discount');
      }

      const updatedDiscount = await response.json();
      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.id === editDiscountId ? updatedDiscount.discount : discount
        )
      );

      setIsEditing(false);
      setEditDiscountId(null);
      setNewDiscount({
        name: '',
        type: 'occasional',
        startDate: '',
        endDate: '',
        percentage: 0,
        categories: ['all'],
      });

      toast.success(
        updatedDiscount.message || 'Discount updated successfully!'
      );
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update discount'
      );
    }
  };

  const handleDeleteDiscount = async (discountId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/discounts/${discountId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete discount');
      }

      setDiscounts((prev) =>
        prev.filter((discount) => discount.id !== discountId)
      );
      toast.success('Discount deleted successfully!');
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast.error('Failed to delete discount');
    }
  };

  // Filter discounts by search term (name or type)
  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Discount Management</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search discounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
            <button
              onClick={() => setIsAdding(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
            >
              Add Discount
            </button>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Existing Discounts</h2>
          {filteredDiscounts.length === 0 ? (
            <p className="text-center text-gray-500">No discounts available</p>
          ) : (
            <Table className="table-auto w-full border-collapse border border-gray-200">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Type</th>
                  <th className="border px-4 py-2">Start Date</th>
                  <th className="border px-4 py-2">End Date</th>
                  <th className="border px-4 py-2">Percentage</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiscounts.map((discount) => (
                  <tr key={discount.id} className="text-center">
                    <td className="border px-4 py-2">{discount.name}</td>
                    <td className="border px-4 py-2">{discount.type}</td>
                    <td className="border px-4 py-2">
                      {new Date(discount.startDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(discount.endDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="border px-4 py-2">{discount.percentage}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditDiscount(discount.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <AlertDialog
                        open={deleteDialogOpen === discount.id}
                        onOpenChange={(open) =>
                          setDeleteDialogOpen(open ? discount.id : null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Discount</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this discount?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 text-white hover:bg-red-600"
                              onClick={() => {
                                handleDeleteDiscount(discount.id);
                                setDeleteDialogOpen(null);
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Discount</h2>
            <form>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={newDiscount.name}
                    onChange={handleInputChange}
                    placeholder="Discount Name"
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newDiscount.type}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="occasional">Occasional</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={newDiscount.startDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <Input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={newDiscount.endDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label
                    htmlFor="percentage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount Percentage
                  </label>
                  <Input
                    id="percentage"
                    type="number"
                    name="percentage"
                    value={newDiscount.percentage}
                    onChange={handleInputChange}
                    placeholder="Discount Percentage"
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="categories"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apply to Categories
                  </label>
                  <select
                    id="categories"
                    name="categories"
                    multiple
                    value={newDiscount.categories}
                    onChange={handleCategoryChange}
                    className="w-full border rounded px-2 py-1 h-32"
                  >
                    {availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple categories. Select 'All
                    Categories' to apply to all.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleCreateDiscount}
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
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Discount</h2>
            <form>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount Name
                  </label>
                  <Input
                    id="edit-name"
                    type="text"
                    name="name"
                    value={newDiscount.name}
                    onChange={handleInputChange}
                    placeholder="Discount Name"
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="edit-type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount Type
                  </label>
                  <select
                    id="edit-type"
                    name="type"
                    value={newDiscount.type}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="occasional">Occasional</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="edit-startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    name="startDate"
                    value={newDiscount.startDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="edit-endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    name="endDate"
                    value={newDiscount.endDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label
                    htmlFor="edit-percentage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount Percentage
                  </label>
                  <Input
                    id="edit-percentage"
                    type="number"
                    name="percentage"
                    value={newDiscount.percentage}
                    onChange={handleInputChange}
                    placeholder="Discount Percentage"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleSaveEditDiscount}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    setIsEditing(false);
                    setEditDiscountId(null);
                    setNewDiscount({
                      name: '',
                      type: 'occasional',
                      startDate: '',
                      endDate: '',
                      percentage: 0,
                      categories: ['all'],
                    });
                  }}
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
