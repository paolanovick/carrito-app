import React from "react";
import CartItem from "./CartItem";

const Cart = ({ cartItems, total, removeFromCart, decreaseQuantity }) => {
  return (
    <div>
      <div className="cart">
        <h2>Carrito</h2>
        {cartItems.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            removeFromCart={removeFromCart}
            decreaseQuantity={decreaseQuantity}
          />
        ))}
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default Cart;
