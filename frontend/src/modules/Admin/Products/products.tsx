import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../../../components/ui/alert-dialog';
import { Trash2, Pencil } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stock_quantity: number;
  status: string;
  image_url: string;
}

interface NewProduct {
  name: string;
  price: string;
  category: string;
  image_url: string;
  description: string;
  stock_quantity: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: '',
    category: 'Home Appliance',
    image_url: '',
    description: '',
    stock_quantity: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      String(product.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
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

  const handleAddProduct = () => {
    setIsAdding(true);
    setNewProduct({
      name: '',
      price: '',
      category: 'Home Appliance',
      image_url: '',
      description: '',
      stock_quantity: 0,
    });
  };

  const handleNewProductChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewProductImageChange = async (
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

        setNewProduct((prev) => ({
          ...prev,
          image_url: data.secure_url,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleEditProductImageChange = async (
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

        setSelectedProduct((prev) =>
          prev ? { ...prev, image_url: data.secure_url } : prev
        );
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSaveNewProduct = async () => {
    // Check if all required fields are filled
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.description ||
      !newProduct.stock_quantity ||
      !newProduct.image_url
    ) {
      toast.error('Please fill in all required fields before saving.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add product');
        } else {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error(
            'Unexpected server error. Please check the server logs.'
          );
        }
      }

      const addedProduct = await response.json();
      setProducts((prev) => [addedProduct, ...prev]);
      setIsAdding(false);
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to add product'
      );
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts((prev) =>
        prev.filter((product) => product.id !== Number(productId))
      );
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (productId: string) => {
    const productToEdit = products.find(
      (product) => product.id === Number(productId)
    );
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setIsEditing(true);
    }
  };

  const handleCloseEdit = () => {
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${selectedProduct.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedProduct),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id ? selectedProduct : product
        )
      );

      toast.success('Product updated successfully!');
      handleCloseEdit();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-80 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
            <button
              onClick={handleAddProduct}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
            >
              Create Product
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8">No products found</div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Image</th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Category</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Stock Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>

                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {product.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md mx-auto"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {product.stock_quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm ${
                          product.status === 'Active'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleEditProduct(String(product.id))}
                          className="bg-yellow-300 p-2 text-black hover:bg-yellow-400 rounded-md"
                        >
                          <Pencil size={16} />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-white bg-red-600 p-2 hover:bg-red-700 rounded-md">
                              <Trash2 size={16} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <h2 className="text-lg font-bold">
                                Confirm Deletion
                              </h2>
                              <p>
                                Are you sure you want to delete this product?
                              </p>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteProduct(String(product.id))
                                }
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 0 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                type="button"
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

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form>
              <div className="mb-4 flex flex-col items-center">
                {newProduct.image_url && (
                  <img
                    src={newProduct.image_url}
                    alt="Product Preview"
                    className="w-24 h-24 rounded-full mb-2"
                  />
                )}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-center">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewProductImageChange}
                    required
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
                    value={newProduct.name}
                    onChange={handleNewProductChange}
                    required
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                    required
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter product price"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleNewProductChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Home Appliance">Home Appliance</option>
                    <option value="Gadgets">Gadgets</option>
                    <option value="Furnitures">Furnitures</option>
                    <option value="Smart Home">Smart Home</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={newProduct.stock_quantity}
                    onChange={handleNewProductChange}
                    required
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter stock quantity"
                  />
                </div>
                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleNewProductChange}
                    required
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter product description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleSaveNewProduct}
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="mb-4 flex flex-col items-center">
              {selectedProduct?.image_url && (
                <img
                  src={selectedProduct.image_url}
                  alt="Product Preview"
                  className="w-24 h-24 rounded-full mb-2"
                />
              )}
              <div className="mt-2">
                <label className="block text-sm font-medium text-center">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditProductImageChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                />
              </div>
            </div>
            <form>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium">ID</label>
                  <input
                    type="text"
                    value={selectedProduct?.id}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={selectedProduct?.name}
                    onChange={(e) =>
                      setSelectedProduct((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="text"
                    value={selectedProduct?.price}
                    onChange={(e) =>
                      setSelectedProduct((prev) =>
                        prev ? { ...prev, price: e.target.value } : prev
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    type="text"
                    value={selectedProduct?.category}
                    onChange={(e) =>
                      setSelectedProduct((prev) =>
                        prev ? { ...prev, category: e.target.value } : prev
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={selectedProduct?.stock_quantity}
                    onChange={(e) =>
                      setSelectedProduct((prev) =>
                        prev
                          ? { ...prev, stock_quantity: Number(e.target.value) }
                          : prev
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    value={selectedProduct?.status}
                    onChange={(e) =>
                      setSelectedProduct((prev) =>
                        prev ? { ...prev, status: e.target.value } : prev
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleCloseEdit}
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
