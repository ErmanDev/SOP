import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Product {
  product_id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  status?: string;
  discount_percentage?: number;
  discount_startDate?: string;
  discount_endDate?: string;
}

interface CartItem extends Product {
  quantity: number;
  discountedPrice?: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface Customer {
  id: number;
  account_number: string;
  name: string;
}

export default function Pos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeDiscount, setActiveDiscount] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState(() => {
    const savedOrderNumber = localStorage.getItem('lastOrderNumber');
    return savedOrderNumber ? parseInt(savedOrderNumber) : 1;
  });
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', count: 0 },
    { id: 'Home Appliance', name: 'Home Appliance', count: 0 },
    { id: 'Gadgets', name: 'Gadgets', count: 0 },
    { id: 'Furnitures', name: 'Furnitures', count: 0 },
    { id: 'Smart Home', name: 'Smart Home', count: 0 },
  ]);
  const [accountNumber, setAccountNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cashAmount, setCashAmount] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      const processedProducts = data.map((product: Product) => ({
        ...product,
        price: Number(product.price),
        discount_percentage: Number(product.discount_percentage || 0),
        discount_startDate: product.discount_startDate
          ? new Date(product.discount_startDate)
          : null,
        discount_endDate: product.discount_endDate
          ? new Date(product.discount_endDate)
          : null,
      }));

      setProducts(processedProducts);

      setCategories((prevCategories) =>
        prevCategories.map((category) => {
          if (category.id === 'all') {
            return { ...category, count: processedProducts.length };
          } else {
            const count = processedProducts.filter(
              (product: Product) =>
                product.category === category.id &&
                product.status !== 'Inactive'
            ).length;
            return { ...category, count };
          }
        })
      );
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const refreshInterval = setInterval(fetchProducts, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_id === product.product_id
      );

      // Calculate discounted price if discount exists and is active
      const currentDate = new Date();
      const isDiscountActive =
        typeof product.discount_percentage === 'number' &&
        product.discount_startDate &&
        product.discount_endDate &&
        new Date(product.discount_startDate) <= currentDate &&
        new Date(product.discount_endDate) >= currentDate;

      const discountedPrice = isDiscountActive
        ? product.price * (1 - (product.discount_percentage || 0) / 100)
        : product.price;

      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? {
                ...item,
                quantity: item.quantity + 1,
                discountedPrice,
                discount_percentage: isDiscountActive
                  ? product.discount_percentage
                  : 0,
                discount_startDate: product.discount_startDate,
                discount_endDate: product.discount_endDate,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
          discountedPrice,
          discount_percentage: isDiscountActive
            ? product.discount_percentage
            : 0,
          discount_startDate: product.discount_startDate,
          discount_endDate: product.discount_endDate,
        },
      ];
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = newQuantity;
      return updatedCart;
    });
  };

  const calculateSubtotal = () => {
    return cart
      .reduce((total, item) => {
        const price = item.discountedPrice || item.price;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const calculateVAT = () => {
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal * 0.12).toFixed(2); // 12% VAT
  };

  // Updated calculateDiscount to include a 12% local tax for the Philippines.
  const calculateDiscount = () => {
    if (!activeDiscount) return '0';
    const subtotal = parseFloat(calculateSubtotal());
    const discount = activeDiscount === 'PWD' ? 0.1 : 0.15;
    return (subtotal * discount).toFixed(2);
  };

  // Calculate final total including VAT
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const discount = parseFloat(calculateDiscount());
    const vat = parseFloat(calculateVAT());
    return (subtotal - discount + vat).toFixed(2);
  };

  // Updated filteredProducts to exclude products with a status of 'Inactive'.
  const filteredProducts =
    selectedCategory === 'all'
      ? products.filter((product) => product.status !== 'Inactive')
      : products.filter(
          (product) =>
            product.category === selectedCategory &&
            product.status !== 'Inactive'
        );

  // Ensure product.price is a number before rendering
  const sanitizedProducts = filteredProducts.map((product) => ({
    ...product,
    price: Number(product.price) || 0, // Convert to number or default to 0
  }));

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Check for customer name in all cases
    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    // Additional validation for account number
    if (accountNumber && accountNumber !== '0' && !customerName.trim()) {
      toast.error('Please check customer account number first');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    const total = parseFloat(calculateTotal());
    const cash = parseFloat(cashAmount);

    if (isNaN(cash) || cash < total) {
      toast.error('Insufficient cash amount');
      return;
    }

    try {
      // Get customer ID if account number is provided
      let customerId = null;
      if (accountNumber && accountNumber !== '0') {
        try {
          const customerResponse = await axios.get(
            `http://localhost:5000/api/customers/check/${accountNumber}`
          );
          if (customerResponse.data) {
            customerId = customerResponse.data.id;
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          toast.error('Error fetching customer information');
          return;
        }
      }

      // Create the sale record with proper customer ID
      const saleData = {
        amount: total,
        customerId: customerId,
        customerName: customerName.trim(),
        items: cart.map((item) => {
          const productId = item.product_id;
          console.log('Processing item:', { productId, name: item.name });
          return {
            productId,
            quantity: item.quantity,
            price: item.discountedPrice || item.price,
          };
        }),
      };

      console.log('Sending sale data:', saleData);

      // Process the sale
      const saleResponse = await axios.post(
        'http://localhost:5000/api/sales/create',
        saleData
      );
      console.log('Sale response:', saleResponse.data);

      // Update product stock
      for (const item of cart) {
        try {
          const stockResponse = await axios.put(
            `http://localhost:5000/api/products/update-stock/${item.product_id}`,
            {
              quantity: item.quantity,
            }
          );
          console.log(
            `Stock update response for product ${item.name}:`,
            stockResponse.data
          );
        } catch (stockError) {
          console.error(
            `Error updating stock for product ${item.name}:`,
            stockError
          );
          continue;
        }
      }

      // Update customer total amount if customer exists
      if (customerId) {
        try {
          const customerUpdateResponse = await axios.post(
            'http://localhost:5000/api/customers/update-total',
            {
              account_number: accountNumber,
              amount: total,
            }
          );
          console.log('Customer update response:', customerUpdateResponse.data);
          toast.success('Customer total amount updated successfully');
        } catch (customerError) {
          console.error('Error updating customer total:', customerError);
          toast.error('Failed to update customer total');
        }
      }

      // Refresh products list to get updated stock quantities
      await fetchProducts();

      const nextOrderNumber = orderNumber + 1;
      localStorage.setItem('lastOrderNumber', nextOrderNumber.toString());
      setOrderNumber(nextOrderNumber); // Increment order number
      setCart([]); // Clear cart after payment
      setActiveDiscount(null); // Clear discount
      setCustomerName(''); // Clear customer name
      setAccountNumber(''); // Clear account number
      setCashAmount(''); // Clear cash amount
      setShowPaymentModal(false); // Close payment modal
      toast.success('Payment processed successfully');
    } catch (error) {
      console.error('Error processing payment:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || 'Failed to process payment';
        console.error('Server error response:', error.response.data);
        toast.error(errorMessage);
      } else {
        toast.error('Failed to process payment');
      }
    }
  };

  const handleAccountNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setAccountNumber(value);
  };

  const handleCheckAccount = async () => {
    if (!accountNumber) {
      toast.error('Please enter an account number');
      return;
    }

    // Special case for "0" - allow manual name input
    if (accountNumber === '0') {
      setShowNameInput(true);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/customers/check/${accountNumber}`
      );
      if (response.data) {
        setFoundCustomer(response.data);
        setShowCustomerDialog(true);
      }
    } catch {
      toast.error('Account number does not exist');
    }
  };

  const handleConfirmCustomer = () => {
    if (foundCustomer) {
      setCustomerName(foundCustomer.name);
      setShowCustomerDialog(false);
      toast.success(`Customer ${foundCustomer.name} selected`);
    }
  };

  const handleManualNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName) {
      setShowNameInput(false);
      toast.success(`Customer name set to ${customerName}`);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-500 min-h-screen text-white flex items-center justify-center">
        <div className="text-2xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-500 min-h-screen text-white">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Categories and Account Number Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category.id
                  ? 'bg-pink-500'
                  : 'bg-purple-700'
              }`}
            >
              <div className="text-lg font-bold">{category.name}</div>
              <div className="text-sm">{category.count}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-white font-semibold">Account Number:</label>
          <input
            type="text"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            className="px-3 py-1 rounded-lg text-black"
            placeholder="Enter account number"
          />
          <button
            onClick={handleCheckAccount}
            className="px-4 py-1 rounded-lg bg-purple-700 text-white hover:bg-purple-800"
          >
            Check
          </button>
        </div>
      </div>

      {/* Customer Name Display */}
      {customerName && (
        <div className="mb-4 text-right">
          <span className="bg-purple-700 px-4 py-2 rounded-lg">
            Customer: {customerName}
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4">
        {/* Products */}
        <div className="col-span-2 grid grid-cols-4 gap-4">
          {sanitizedProducts.map((product) => {
            const currentDate = new Date();
            const isDiscountActive =
              typeof product.discount_percentage === 'number' &&
              product.discount_startDate &&
              product.discount_endDate &&
              new Date(product.discount_startDate) <= currentDate &&
              new Date(product.discount_endDate) >= currentDate;

            const discountedPrice = isDiscountActive
              ? product.price * (1 - (product.discount_percentage || 0) / 100)
              : product.price;

            return (
              <div
                key={product.product_id}
                className="bg-white text-black rounded-lg shadow-md p-4 flex flex-col items-center justify-between cursor-pointer hover:shadow-lg w-48 h-64"
                onClick={() => handleAddToCart(product)}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-24 w-24 mb-4 object-cover rounded-full border border-gray-300"
                />
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">{product.name}</div>
                  <div className="text-sm text-gray-700 mb-1">
                    {isDiscountActive ? (
                      <div>
                        <span className="line-through text-gray-500">
                          ₱{product.price.toFixed(2)}
                        </span>
                        <span className="text-green-600 ml-2">
                          ₱{discountedPrice.toFixed(2)}
                        </span>
                        <div className="text-xs text-red-600">
                          {product.discount_percentage}% OFF
                        </div>
                      </div>
                    ) : (
                      <span>₱{product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Stock: {product.stock_quantity}
                  </div>
                </div>
                <button className="mt-2 bg-purple-600 text-white py-1 px-3 rounded-lg hover:bg-purple-700">
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>

        {/* Cart */}
        <div className="bg-white text-black rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">
            Order No: {orderNumber.toString().padStart(6, '0')}
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto h-64">
            {cart.map((item, index) => {
              const currentDate = new Date();
              const isDiscountActive =
                item.discount_percentage &&
                item.discount_startDate &&
                item.discount_endDate &&
                new Date(item.discount_startDate) <= currentDate &&
                new Date(item.discount_endDate) >= currentDate;

              return (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-lg">{item.name}</div>
                    {isDiscountActive ? (
                      <div>
                        <span className="line-through text-gray-500">
                          ₱{item.price.toFixed(2)}
                        </span>
                        <span className="text-green-600 ml-2">
                          ₱{item.discountedPrice?.toFixed(2)}
                        </span>
                        <div className="text-xs text-red-600">
                          {item.discount_percentage}% OFF
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-700">
                        ₱{item.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          index,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 border rounded text-center"
                    />
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₱{calculateSubtotal()}</span>
            </div>
            {activeDiscount && (
              <div className="flex justify-between text-green-600">
                <div className="flex items-center">
                  <span>{activeDiscount} Discount:</span>
                  <button
                    onClick={() => setActiveDiscount(null)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <span>-₱{calculateDiscount()}</span>
              </div>
            )}
            <div className="flex justify-between text-green-600">
              <span>VAT (12%):</span>
              <span>₱{calculateVAT()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>₱{calculateTotal()}</span>
            </div>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => setActiveDiscount('PWD')}
              className={`flex-1 py-2 rounded-lg ${
                activeDiscount === 'PWD'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={activeDiscount !== null}
            >
              PWD (10%)
            </button>
            <button
              onClick={() => setActiveDiscount('Senior Citizen')}
              className={`flex-1 py-2 rounded-lg ${
                activeDiscount === 'Senior Citizen'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={activeDiscount !== null}
            >
              Senior Citizen (15%)
            </button>
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-purple-600 text-white py-2 rounded-lg mt-4 hover:bg-purple-700"
          >
            Payment
          </button>
        </div>
      </div>

      {/* Customer Dialog */}
      {showCustomerDialog && foundCustomer && (
        <AlertDialog
          open={showCustomerDialog}
          onOpenChange={setShowCustomerDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Make Customer</AlertDialogTitle>
              <AlertDialogDescription>
                Customer found: {foundCustomer.name}
                <br />
                Would you like to proceed with this customer?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowCustomerDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmCustomer}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Manual Name Input Dialog */}
      {showNameInput && (
        <AlertDialog open={showNameInput} onOpenChange={setShowNameInput}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Enter Customer Name</AlertDialogTitle>
              <AlertDialogDescription>
                <form onSubmit={handleManualNameSubmit} className="mt-4">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-black border"
                    placeholder="Enter customer name"
                    required
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <AlertDialogCancel onClick={() => setShowNameInput(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction type="submit">Confirm</AlertDialogAction>
                  </div>
                </form>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <AlertDialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Payment Details</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span>₱{calculateTotal()}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cash Amount:
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-black border"
                      placeholder="Enter cash amount"
                      required
                    />
                  </div>
                  {cashAmount && (
                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span
                        className={`${
                          parseFloat(cashAmount) -
                            parseFloat(calculateTotal()) <
                          0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        ₱
                        {(
                          parseFloat(cashAmount) - parseFloat(calculateTotal())
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <AlertDialogCancel onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handlePaymentSubmit}>
                    Confirm Payment
                  </AlertDialogAction>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
