import React from "react";

const CartItem = ({ item, removeFromCart }) => (
  <div className="cart-item">
    {item.title} -{" "}
    {item.price.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
    <button onClick={() => removeFromCart(item)}>X</button>
  </div>
);

export default CartItem;
