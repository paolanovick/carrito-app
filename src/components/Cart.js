import React from "react";
import CartItem from "./CartItem";

const Cart = ({ cart, removeFromCart }) => (
  <div className="cart">
    <h3>Carrito de compras</h3>
    {cart.length === 0 && <p>No hay productos</p>}
    {cart.map((item) => (
      <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
    ))}
  </div>
);

export default Cart;
