import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost/Assignment1/orders.php');
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Error fetching orders. Please try again.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order ID: {order.id}, Total Price: {order.total_price}, Delivery Truck: {order.delivery_truck}, Starting Location: {order.starting_location}, Destination: {order.destination}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
