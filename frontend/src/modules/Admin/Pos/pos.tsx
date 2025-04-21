import { useState } from 'react';

export default function Pos() {
  const categories = [
    { id: 'all', name: 'All', count: 23145 },
    { id: 'home-appliance', name: 'Home Appliance', count: 224 },
    { id: 'gadgets', name: 'Gadgets', count: 509 },
    { id: 'furnitures', name: 'Furnitures', count: 425 },
    { id: 'smart-home', name: 'Smart Home', count: 628 },
  ];

  const products = [
    {
      name: 'Smartphone',
      price: '₱15,000.00',
      image: 'https://source.unsplash.com/200x200/?smartphone',
    },
    {
      name: 'Laptop',
      price: '₱45,000.00',
      image: 'https://source.unsplash.com/200x200/?laptop',
    },
    {
      name: 'Headphones',
      price: '₱3,500.00',
      image: 'https://source.unsplash.com/200x200/?headphones',
    },
    {
      name: 'Smartwatch',
      price: '₱8,000.00',
      image: 'https://source.unsplash.com/200x200/?smartwatch',
    },
    {
      name: 'Refrigerator',
      price: '₱25,000.00',
      image: 'https://source.unsplash.com/200x200/?refrigerator',
    },
    {
      name: 'Microwave',
      price: '₱7,000.00',
      image: 'https://source.unsplash.com/200x200/?microwave',
    },
    {
      name: 'Sofa',
      price: '₱20,000.00',
      image: 'https://source.unsplash.com/200x200/?sofa',
    },
    {
      name: 'Dining Table',
      price: '₱18,000.00',
      image: 'https://source.unsplash.com/200x200/?dining-table',
    },
    {
      name: 'Television',
      price: '₱30,000.00',
      image: 'https://source.unsplash.com/200x200/?television',
    },
    {
      name: 'Air Conditioner',
      price: '₱35,000.00',
      image: 'https://source.unsplash.com/200x200/?air-conditioner',
    },
    {
      name: 'Washing Machine',
      price: '₱22,000.00',
      image: 'https://source.unsplash.com/200x200/?washing-machine',
    },
    {
      name: 'Vacuum Cleaner',
      price: '₱5,000.00',
      image: 'https://source.unsplash.com/200x200/?vacuum-cleaner',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      const isProductInCart = prevCart.some(
        (item) => item.name === product.name
      );

      if (!isProductInCart) {
        return [...prevCart, { ...product, quantity: 1 }];
      }

      return updatedCart;
    });
  };

  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, newQuantity) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = newQuantity;
      return updatedCart;
    });
  };

  const calculateTotal = () => {
    return cart
      .reduce(
        (total, item) =>
          total +
          parseFloat(item.price.replace('₱', '').replace(',', '')) *
            item.quantity,
        0
      )
      .toFixed(2);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-500 min-h-screen text-white">
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
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white text-black rounded-lg shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg"
              onClick={() => handleAddToCart(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 rounded-full mb-4 object-cover"
              />
              <div className="text-center">
                <div className="font-bold">{product.name}</div>
                <div className="text-sm">{product.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div className="bg-white text-black rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Order No: 123125</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm">Price: {item.price}</div>
                  <div className="text-sm flex items-center">
                    Quantity:
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          index,
                          parseInt(e.target.value || '0', 10)
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
              <span>₱{calculateTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₱{(calculateTotal() * 0.12).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>₱{(calculateTotal() * 1.12).toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg mt-4 hover:bg-purple-700">
            Payment
          </button>
        </div>
      </div>
    </div>
  );
}
