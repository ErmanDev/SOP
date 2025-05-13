import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  product_id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function Pos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeDiscount, setActiveDiscount] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState(1);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', count: 0 },
    { id: 'Home Appliance', name: 'Home Appliance', count: 0 },
    { id: 'Gadgets', name: 'Gadgets', count: 0 },
    { id: 'Furnitures', name: 'Furnitures', count: 0 },
    { id: 'Smart Home', name: 'Smart Home', count: 0 },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);

        // Update category counts dynamically
        const updatedCategories = categories.map((category) => {
          if (category.id === 'all') {
            return { ...category, count: response.data.length };
          } else {
            const count = response.data.filter(
              (product: Product) => product.category === category.id
            ).length;
            return { ...category, count };
          }
        });
        setCategories(updatedCategories);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_id === product.product_id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
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
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateDiscount = () => {
    if (!activeDiscount) return '0';
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal * 0.1).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const discount = parseFloat(calculateDiscount());
    const tax = (subtotal - discount) * 0.12;
    return (subtotal - discount + tax).toFixed(2);
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Ensure product.price is a number before rendering
  const sanitizedProducts = filteredProducts.map((product) => ({
    ...product,
    price: Number(product.price) || 0, // Convert to number or default to 0
  }));

  const handlePayment = () => {
    // Process payment logic here
    setCart([]); // Clear cart after payment
    setActiveDiscount(null); // Clear discount
    setOrderNumber((prev) => prev + 1); // Increment order number
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

      {/* Categories */}
      <div className="flex space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category.id ? 'bg-pink-500' : 'bg-purple-700'
            }`}
          >
            <div className="text-lg font-bold">{category.name}</div>
            <div className="text-sm">{category.count}</div>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4">
        {/* Products */}
        <div className="col-span-2 grid grid-cols-4 gap-4">
          {sanitizedProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-white text-black rounded-lg shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg w-48 h-48"
              onClick={() => handleAddToCart(product)}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="h-20 w-20 mb-4 object-cover"
              />
              <div className="text-center">
                <div className="font-bold">{product.name}</div>
                <div className="text-sm">₱{product.price.toFixed(2)}</div>
                <div className="text-xs text-gray-500">
                  Stock: {product.stock_quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="bg-white text-black rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">
            Order No: {orderNumber.toString().padStart(6, '0')}
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm">Price: ₱{item.price.toFixed(2)}</div>
                  <div className="text-sm flex items-center">
                    Quantity:
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
                      className="ml-2 w-16 border rounded text-center"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₱{calculateSubtotal()}</span>
            </div>
            {activeDiscount && (
              <div className="flex justify-between text-green-600">
                <div className="flex items-center">
                  <span>{activeDiscount} Discount (10%):</span>
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
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>
                ₱
                {(
                  (parseFloat(calculateSubtotal()) -
                    parseFloat(calculateDiscount())) *
                  0.12
                ).toFixed(2)}
              </span>
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
                  : 'bg-gray-200 text-gray-700'
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
                  : 'bg-gray-200 text-gray-700'
              }`}
              disabled={activeDiscount !== null}
            >
              Senior Citizen (10%)
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
    </div>
  );
}
