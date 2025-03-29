import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, 
          totalPrice, 
          deliveryTruck, 
          origin, 
          destination, 
          distance, 
          deliveryPrice,
          storeCode
        } = location.state;

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tripError, setTripError] = useState(null);
  const [tripSuccess, setTripSuccess] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [shoppingError, setShoppingError] = useState(null);
  const [shoppingSuccess, setShoppingSuccess] = useState(false);
  const [shoppingDetails, setShoppingDetails] = useState(null);

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!deliveryTruck) {
      setTripError("Truck ID is missing. Please select a delivery truck.");
      return;
    }

    const tripData = {
      source_code: origin,
      destination_code: destination,
      distance: distance,
      truck_id: deliveryTruck, 
      price: deliveryPrice,
    };

    const shoppingData = {
      store_code: storeCode,
      total_price: totalPrice,
    };

    try {
      // create trip
      const tripResponse = await axios.post("http://localhost/Assignment1/create_trip.php", tripData);
      console.log("Trip response:", tripResponse.data);

      if (tripResponse.data.success) {
        setTripError(null);
        setTripSuccess(true);

        // fetch trip details
        const tripId = tripResponse.data.trip_id;
        console.log("Trip ID:", tripId);

        if (!tripId) {
          throw new Error("Trip ID is undefined.");
        }

        const tripDetailsResponse = await axios.get(`http://localhost/Assignment1/get_trip.php?trip_id=${tripId}`);
        console.log("Trip details response:", tripDetailsResponse.data);

        if (tripDetailsResponse.data.success) {
          setTripDetails(tripDetailsResponse.data.data);
        } else {
          console.error("Failed to fetch trip details:", tripDetailsResponse.data.error);
          setTripError("Failed to fetch trip details. Please try again.");
        }

        // create shopping
        const shoppingResponse = await axios.post("http://localhost/Assignment1/create_shopping.php", shoppingData);
        console.log("Shopping response:", shoppingResponse.data);

        if (shoppingResponse.data.success) {
          setShoppingError(null);
          setShoppingSuccess(true);

          // fetch shopping details
          const receiptId = shoppingResponse.data.receipt_id;
          console.log("Receipt ID:", receiptId);

          if (!receiptId) {
            throw new Error("Receipt ID is undefined.");
          }

          const shoppingDetailsResponse = await axios.get(`http://localhost/Assignment1/get_shopping.php?receipt_id=${receiptId}`);
          console.log("Shopping details response:", shoppingDetailsResponse.data);

          if (shoppingDetailsResponse.data.success) {
            setShoppingDetails(shoppingDetailsResponse.data.data);

            // create order after receiving trip and shopping details
            const orderData = {
              total_price: totalPrice,
              delivery_truck: deliveryTruck,
              starting_location: origin,
              destination: destination,
              date_issued: new Date().toISOString().split('T')[0], // current date
              payment_code: paymentInfo.cardNumber, 
              user_id: '1', // Hardcoded, user is not working
              trip_id: tripId,
              receipt_id: receiptId,
              date_received: '01-01-01' // not received yet
            };

            const orderResponse = await axios.post("http://localhost/Assignment1/create_order.php", orderData);
            console.log("Order response:", orderResponse.data);

            if (orderResponse.data.success) {
              setError(null);
              setSuccess(true);
          
              // redirect to a success page
              setTimeout(() => {
                navigate('/'); // redirect to homepage
              }, 3000);
            } else {
              setError(orderResponse.data.error || "Failed to create order. Please try again.");
            }
          } else {
            console.error("Failed to fetch shopping details:", shoppingDetailsResponse.data.error);
            setShoppingError("Failed to fetch shopping details. Please try again.");
          }
        } else {
          setShoppingError(shoppingResponse.data.error || "Failed to create shopping record. Please try again.");
        }
      } else {
        setTripError(tripResponse.data.error || "Failed to create trip. Please try again.");
      }
    } catch (error) {
      console.error("Error creating trip or shopping record:", error);
      setTripError("An error occurred while submitting the trip. Please try again.");
    }
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setPaymentInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  useEffect(() => {
    console.log("Success state changed:", success);
  }, [success]);

  return (
    <div>
      <h1>Order Summary</h1>
      <div>
        <h2>Selected Items:</h2>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.Item_name} - ${item.Price} x {item.quantity || 1}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handlePaymentSubmit}>
        <h2>Payment Information</h2>
        <div>
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input
            type="text"
            id="expiryDate"
            placeholder="MM/YY"
            value={paymentInfo.expiryDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            value={paymentInfo.cvv}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>

      <h1>Invoice</h1>

      {tripError && !tripSuccess && <p style={{ color: 'red' }}>{tripError}</p>}
      {tripSuccess && (
        <div>
          <p style={{ color: 'green' }}>Trip submitted successfully!</p>
          {tripDetails && (
            <div>
              <h2>Trip Details</h2>
              <p><strong>Trip ID:</strong> {tripDetails.Trip_Id}</p>
              <p><strong>Source Code:</strong> {tripDetails.Source_Code}</p>
              <p><strong>Destination Code:</strong> {tripDetails.Destination_Code}</p>
              <p><strong>Distance:</strong> {tripDetails.Distance} km</p>
              <p><strong>Truck ID:</strong> {tripDetails.Truck_Id}</p>
              <p><strong>Price:</strong> ${tripDetails.Price}</p>
            </div>
          )}
        </div>
      )}

      {shoppingError && !shoppingSuccess && <p style={{ color: 'red' }}>{shoppingError}</p>}
      {shoppingSuccess && (
        <div>
          <p style={{ color: 'green' }}>Shopping record created successfully!</p>
          {shoppingDetails && (
            <div>
              <h2>Receipt</h2>
              <p><strong>Receipt ID:</strong> {shoppingDetails.Receipt_Id}</p>
              <p><strong>Store Code:</strong> {shoppingDetails.Store_Code}</p>
              <p><strong>Total Price:</strong> ${shoppingDetails.Total_Price}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderSummary;