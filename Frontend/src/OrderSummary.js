import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './OrderSummary.css';

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

  // Default payment method is credit card
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tripError, setTripError] = useState(null);
  const [tripSuccess, setTripSuccess] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [shoppingError, setShoppingError] = useState(null);
  const [shoppingSuccess, setShoppingSuccess] = useState(false);
  const [shoppingDetails, setShoppingDetails] = useState(null);

  // Can't place order if user isn't logged in
  const getUserId = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      throw new Error("Access token is missing. Please log in.");
    }

    try {
      const response = await axios.post(
        "http://localhost/Assignment1/access_token_check.php",
        {},
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        return response.data.user_id;
      } else {
        throw new Error("Invalid access token. Please log in.");
      }
    } catch (error) {
      console.error("Error verifying access token:", error);
      throw new Error("Failed to verify access token. Please log in.");
    }
  };

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

            const userId = await getUserId();

            // Extract item IDs from cartItems
            const itemIds = cartItems.map(item => item.Item_Id);

            // create order after receiving trip and shopping details
            const orderData = {
              total_price: totalPrice,
              delivery_truck: deliveryTruck,
              starting_location: origin,
              destination: destination,
              date_issued: new Date().toISOString().split('T')[0], // current date as string
              payment_code: paymentMethod === 'payAtDoor' ? 'Pay at Door' : paymentInfo.cardNumber, 
              payment_type: paymentMethod, 
              item_ids: itemIds, 
              user_id: userId,
              trip_id: tripId,
              receipt_id: receiptId,
              date_received: null // package not received yet
            };

            const orderResponse = await axios.post("http://localhost/Assignment1/create_order.php", orderData);
            console.log("Order response:", orderResponse.data);

            if (orderResponse.data.success) {
              setError(null);
              setSuccess(true);
          
              const existingItems = JSON.parse(localStorage.getItem("purchasedItems")) || [];

              const updatedItems = [...existingItems, ...cartItems].reduce((acc, item) => {
                if (!acc.some(existingItem => existingItem.Item_Id === item.Item_Id)) {
                  acc.push(item);
                }
                return acc;
              }, []);

              localStorage.setItem("purchasedItems", JSON.stringify(updatedItems));

              // setTimeout(() => {
              //   navigate('/orders'); 
              // }, 3000);
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

  // useEffect(() => {
  //   console.log("Payment Info Updated:", paymentInfo);
  // }, [paymentInfo]);

  useEffect(() => {
    console.log("Success state changed:", success);
  }, [success]);

  return (
    <div className="order-summary-container">
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
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            required
          >
            <option value="creditCard">Credit Card</option>
            <option value="debitCard">Debit Card</option>
            <option value="payAtDoor">Pay at Door</option>
          </select>
        </div>

        {paymentMethod !== 'payAtDoor' && (
          <>
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
          </>
        )}

        {paymentMethod === 'payAtDoor' && (
          <p className="info">
            Please have your payment ready at the door.
          </p>
        )}

        <button type="submit">Submit Payment</button>
      </form>

      <h1>Invoice</h1>

      {tripError && !tripSuccess && <p className="error">{tripError}</p>}
      {tripSuccess && (
        <div className="section">
          <p className="success">Trip record submitted successfully!</p>
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

      {shoppingError && !shoppingSuccess && <p className="error">{shoppingError}</p>}
      {shoppingSuccess && (
        <div className="section">
          <p className="success">Shopping record created successfully!</p>
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