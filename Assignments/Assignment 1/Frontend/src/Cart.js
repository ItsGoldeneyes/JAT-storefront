import React, { useState, useEffect } from 'react';
import GoogleMapsComponent from './GoogleMaps';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    console.log("Loaded items from localStorage:", storedItems);
    setCartItems(storedItems);
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      console.log("Saving items to localStorage:", cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, initialLoad]);

  const toggleSelect = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].selected = !updatedCart[index].selected;
    setCartItems(updatedCart);
  };

  const incrementQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };

  const decrementQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    }
    setCartItems(updatedCart);
  };

  const deleteItem = (index) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== index);
    setCartItems(updatedCart);
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((val, key) => (
              <tr key={key}>
                <td>
                <input
                    type="checkbox"
                    checked={val.selected}
                    onChange={() => toggleSelect(key)}
                  />
                </td>
                <td><img src={val.image} alt={val.name} width="100" /></td>
                <td>{val.name}</td>
                <td>${val.price}</td>
                <td>
                  <button onClick={() => decrementQuantity(key)}>-</button>
                  {val.quantity || 1}
                  <button onClick={() => incrementQuantity(key)}>+</button>
                </td>
                <td>
                  <button onClick={() => deleteItem(key)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <GoogleMapsComponent />
      </div>
    </div>
  );
}

export default Cart;
