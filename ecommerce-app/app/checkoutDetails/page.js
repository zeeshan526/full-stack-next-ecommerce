'use client';
import React, { useContext, useState } from 'react';
import { CartContext } from '../components/CartContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

const CheckoutForm = ({ clientSecret, userDetails, setCartProducts, paymentMethod }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  // Handle form submission for Stripe payment or COD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (!stripe || !elements || !clientSecret) {
        toast.error('Payment system is not ready.');
        return;
      }

      const cardElement = elements.getElement(CardElement);

      try {
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: userDetails.fullName,
              email: userDetails.email,
            },
          },
        });

        if (paymentResult.error) {
          toast.error(`Payment error: ${paymentResult.error.message}`);
        } else if (paymentResult.paymentIntent.status === 'succeeded') {
          toast.success('Payment successful!');
          setCartProducts([]);
          setTimeout(() => {
            router.push('/thankyouPage');
          }, 1000);
        } else {
          toast.error(`Unexpected payment state: ${paymentResult.paymentIntent.status}`);
        }
      } catch (error) {
        toast.error('Payment failed. Please try again.');
      }
    } else if (paymentMethod === 'cod') {
      // For COD, just redirect to thank you page and consider order placed
      toast.success('Order placed successfully with Cash on Delivery!');
      setCartProducts([]);
      setTimeout(() => {
        router.push('/thankyouPage');
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toaster position="top-right" reverseOrder={false} />
      {paymentMethod === 'card' && (
        <div className="bg-white p-6 shadow-lg rounded-lg mb-4">
          <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
          <CardElement />
        </div>
      )}

      <button
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105"
        type="submit"
        disabled={paymentMethod === 'card' && !clientSecret}
      >
        Complete Payment
      </button>
    </form>
  );
};

const PaymentDetailsPage = () => {
  const { cartProducts, setCartProducts, calculateTotalPrice } = useContext(CartContext);
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    city: '',
    postalCode: '',
    country: '',
    shippingAddress: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card'); // New state for payment method
  const [isUserInfoSaved, setIsUserInfoSaved] = useState(false); // Tracks if user info is saved

  // Form submission to create order and get Stripe clientSecret or handle COD
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (
      !userDetails.fullName ||
      !userDetails.email ||
      !userDetails.city ||
      !userDetails.postalCode ||
      !userDetails.country ||
      !userDetails.shippingAddress
    ) {
      toast.error('Please fill out all the fields.');
      return;
    }

    const totalPrice = calculateTotalPrice();
    const orderData = {
      userDetails: {
        fullName: userDetails.fullName,
        email: userDetails.email,
        shippingAddress: {
          city: userDetails.city,
          postalCode: userDetails.postalCode,
          country: userDetails.country,
          address: userDetails.shippingAddress,
        },
      },
      orderDetails: {
        cartProducts: cartProducts.map((product) => ({
          _id: product._id,
          title: product.title,
          price: product.price,
          quantity: product.quantity,
        })),
        totalPrice: totalPrice,
        currency: 'USD',
        paymentMethod, // Include payment method in order data
      },
    };

    if (paymentMethod === 'card') {
      // Create PaymentIntent for card payments
      try {
        const response = await axios.post('/api/checkout', orderData);
        setClientSecret(response.data.clientSecret);
        setIsUserInfoSaved(true);
        toast.success('User details saved successfully!');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to create PaymentIntent');
      }
    } else {
      // Handle COD - Save order without payment intent
      try {
        await axios.post('/api/checkout', orderData); // Backend will handle COD orders separately
        setIsUserInfoSaved(true);
        setCartProducts([]);
        toast.success('Order placed successfully with COD!');
        setTimeout(() => {
            router.push('/thankyouPage');
          }, 1000);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to place COD order');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>

      {/* User Details Form */}
      <form onSubmit={handleCreateOrder} className="w-full  bg-white p-6 shadow-lg rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Shipping & Contact Details</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={userDetails.fullName}
            onChange={(e) => setUserDetails({ ...userDetails, fullName: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={userDetails.city}
              onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">Postal Code</label>
            <input
              type="text"
              value={userDetails.postalCode}
              onChange={(e) => setUserDetails({ ...userDetails, postalCode: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Postal Code"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Country</label>
          <input
            type="text"
            value={userDetails.country}
            onChange={(e) => setUserDetails({ ...userDetails, country: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Country"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Shipping Address</label>
          <textarea
            value={userDetails.shippingAddress}
            onChange={(e) => setUserDetails({ ...userDetails, shippingAddress: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main St, City, Country"
          />
        </div>

        {/* Payment Method Selector (using Radio Buttons) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <div className="flex space-x-4">
            <label className="block text-sm font-medium">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Card Payment
            </label>
            <label className="block text-sm font-medium">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery (COD)
            </label>
          </div>
        </div>
        <button
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-6 rounded-lg hover:from-green-600 hover:to-teal-700 transition-transform transform hover:scale-105"
          type="submit"
        >
         {paymentMethod==='cod' ? "Save & Place Your Order" : "Save & Proceed to Payment"} 
        </button>
      </form>

      {/* Render Stripe CheckoutForm only if clientSecret is available and card is selected */}
      {clientSecret && isUserInfoSaved && paymentMethod === 'card' && (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} userDetails={userDetails} setCartProducts={setCartProducts} paymentMethod={paymentMethod} />
        </Elements>
      )}

      {/* Cart Summary */}
      <div className="w-full bg-white p-6 shadow-lg rounded-lg mt-8">
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
