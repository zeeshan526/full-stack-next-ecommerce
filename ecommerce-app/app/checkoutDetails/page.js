'use client';
import React, { useContext, useState } from 'react';
import { CartContext } from '../components/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentDetailsPage = () => {
  const { cartProducts,calculateTotalPrice } = useContext(CartContext);

  // State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!fullName || !email || !city || !postalCode || !country || !shippingAddress) {
      toast.error('All fields are required');
      return;
    }

    // Calculate the total price for the order
    const totalPrice = calculateTotalPrice();

    const orderData = {
        userDetails: {
          fullName,
          email,
          shippingAddress: {
            city,
            postalCode,
            country,
            address: shippingAddress,
          },
        },
        orderDetails: {
          cartProducts: cartProducts.map((product) => ({
            _id: product._id,
            title: product.title,
            price: product.price,
            quantity: product.quantity,
          })),
          totalPrice: calculateTotalPrice(), 
          currency: "USD", 
        },
      };
      

    try {
      await axios.post('/api/checkout', orderData);
      toast.success('Order placed successfully!');
      // Optionally redirect to a success page
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit the order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: User Form */}
        <div className="w-full lg:w-2/3 bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Shipping & Contact Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Postal Code"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Shipping Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main St, City, Country"
              />
            </div>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105"
              type="submit"
            >
              Save & Proceed
            </button>
          </form>
        </div>

        {/* Right Column: Stripe Payment Form */}
        <div className="w-full lg:w-1/3 bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
          <div className="border p-4 rounded-lg">
            <p className="text-center text-gray-600">Stripe Payment Form will go here</p>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="bg-white p-6 shadow-lg rounded-lg">
          {cartProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {cartProducts.map((product) => (
                <div key={product._id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h4 className="font-medium">{product.title}</h4>
                    <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                  </div>
                  <p className="text-right font-semibold">${product.price}</p>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4 font-bold">
                <p>Total</p>
                <p>${calculateTotalPrice()}</p>
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsPage;
