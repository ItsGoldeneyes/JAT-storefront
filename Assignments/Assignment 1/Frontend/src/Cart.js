import React, { useState } from 'react';
import GoogleMapsComponent from './GoogleMaps';

function Cart() {
  const [cartItems, setCartItems] = useState([
    { 
      name: "Samsung Galaxy S25 Ultra 512GB Titanium Silverwhite", 
      image: "assets/samsung_galaxy_ultra.png", 
      price: 2098.99,
      quantity: 1,
      selected: false
    },
    { 
      name: "Apple MacBook Pro 14.2\" 2024 1TB Space Black", 
      image: "assets/2024_macbook_pro.png", 
      price: 2349.99,
      quantity: 1,
      selected: false
    },
    { 
      name: "Apple iPhone 15 128GB Pink", 
      image: "assets/iphone15.png", 
      price: 999.99,
      quantity: 1,
      selected: false
    },
    { 
      name: "HP Omnibook X 14\" 1TB Glacier Silver", 
      image: "assets/hp_omnibook.png", 
      price: 1349.99,
      quantity: 1,
      selected: false
    }
  ]);

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
                  {val.quantity}
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





// import React from 'react';

// function Cart() {

//   const cart_items = [
//     { name: "Samsung Galaxy S25 Ultra 512GB Titanium Silverwhite", 
//       image: "assets/samsung_galaxy_ultra.png", 
//       price: "2098.99" },

//     { name: "Apple MacBook Pro 14.2\" 2024 1TB Space Black", 
//       image: "assets/2024_macbook_pro.png", 
//       price: "2349.99" },

//     { name: "Apple iPhone 15 128GB Pink", 
//       image: "assets/iphone15.png", 
//       price: "999.99" },

//     { name: "HP Omnibook X 14\" 1TB Glacier Silver", 
//       image: "assets/hp_omnibook.png", 
//       price: "1349.99" }
//   ]

//   return (
//     <div>
//       <h1>Shopping Cart</h1>
//       <p>Your cart is currently empty.</p>

//       <table>
//         {cart_items.map((val, key) => {
//           return (
//             <tr key={key}>
//                 <td><img src={val.image} alt={val.name}/></td>
//                 <td> {val.name} {val.price}</td>
//             </tr>
//           )
//         })}
//       </table>
//     </div>
//   );
// }

// export default Cart;
