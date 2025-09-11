import React from "react";

const CartItem = ({ item, removeFromCart, decreaseQuantity }) => {
  return (
    <div className="cart-item">
      <h4>{item.title}</h4>
      <p>Precio: ${item.price}</p>
      <p>Cantidad: {item.quantity}</p>
      <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
      <button onClick={() => decreaseQuantity(item.id)}>Disminuir</button>
      <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
    </div>
  );
};

export default CartItem;
