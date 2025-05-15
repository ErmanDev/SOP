import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Discount {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  amount: number;
}

export default function Discounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    startDate: '',
    endDate: '',
    amount: 0,
  });

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
        toast.error('Failed to fetch discounts');
      }
    };

    fetchDiscounts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewDiscount((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDiscount = async () => {
    if (!newDiscount.name || !newDiscount.startDate || !newDiscount.endDate || !newDiscount.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/discounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiscount),
      });

      if (!response.ok) {
        throw new Error('Failed to create discount');
      }

      const createdDiscount = await response.json();
      setDiscounts((prev) => [createdDiscount, ...prev]);
      setNewDiscount({ name: '', startDate: '', endDate: '', amount: 0 });
      toast.success('Discount created successfully!');
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error('Failed to create discount');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Discount Management</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create New Discount</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newDiscount.name}
            onChange={handleInputChange}
            placeholder="Discount Name"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="date"
            name="startDate"
            value={newDiscount.startDate}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="date"
            name="endDate"
            value={newDiscount.endDate}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="number"
            name="amount"
            value={newDiscount.amount}
            onChange={handleInputChange}
            placeholder="Discount Amount"
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button
          onClick={handleCreateDiscount}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Discount
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Discounts</h2>
        {discounts.length === 0 ? (
          <p>No discounts available</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">End Date</th>
                <th className="border px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td className="border px-4 py-2">{discount.name}</td>
                  <td className="border px-4 py-2">{discount.startDate}</td>
                  <td className="border px-4 py-2">{discount.endDate}</td>
                  <td className="border px-4 py-2">{discount.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
