'use client'
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        debugger
        const response = await axios.get("/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);


  console.log("orders", orders);

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-100";
      case "paid":
        return "text-green-500 bg-green-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  if (loading) return <p className="text-center mt-5">Loading orders...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="">Customer Name</th>
              <th className="py-3 px-6 text-left">Customer Email</th>
              <th className="py-3 px-6 text-left">Customer Address</th>
              <th className="py-3 px-6 text-center">Created At</th>
              <th className="py-3 px-6 text-center">payment Method</th>
              <th className="py-3 px-6 text-center">payment Status</th>
              <th className="py-3 px-6 text-center">Toatl Price</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{order?.userDetails?.fullName}</td>
                <td className="py-3 px-6 text-left">{order?.userDetails?.email}</td>
                <td className="py-3 px-6"> {order?.userDetails?.shippingAddress?.city} {order?.userDetails?.shippingAddress?.postalCode} <br /> {order?.userDetails?.shippingAddress?.country} {order?.userDetails?.shippingAddress?.address} </td>
                <td className="py-3 px-6 text-center">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-center">{order.paymentMethod}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`py-1 px-3 rounded-md font-semibold ${getStatusClasses(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                 <td className="py-3 px-6 text-center">
                  <span className=" bg-green-500 text-white px-3 py-1 rounded-full font">
                    $ {order?.orderDetails?.totalPrice}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
