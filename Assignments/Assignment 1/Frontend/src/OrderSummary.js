import React from 'react';
import { useLocation } from 'react-router-dom';

function OrderSummary() {
  const location = useLocation();
  const { cartItems, totalPrice, deliveryTruck, origin, destination } = location.state;

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    alert("Payment submitted successfully!");
  };

  return (
    <div>
      <h1>Order Summary</h1>
      <div>
        <h2>Selected Items:</h2>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price} x {item.quantity || 1}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Total Price: ${totalPrice}</h2>
      </div>
      <div>
        <h2>Delivery Truck: {deliveryTruck}</h2>
      </div>
      <div>
        <h2>origin: {origin}</h2>
      </div>
      <div>
        <h2>Destination: {destination}</h2>
      </div>
      <form onSubmit={handlePaymentSubmit}>
        <h2>Payment Information</h2>
        <div>
          <label htmlFor="cardNumber">Card Number:</label>
          <input type="text" id="cardNumber" required />
        </div>
        <div>
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input type="text" id="expiryDate" placeholder="MM/YY" required />
        </div>
        <div>
          <label htmlFor="cvv">CVV:</label>
          <input type="text" id="cvv" required />
        </div>
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
}

export default OrderSummary;