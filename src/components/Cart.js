import React from "react";

const Cart = ({ cart, removeFromCart }) => {
  if (cart.length === 0) {
    return <p>El carrito está vacío.</p>;
  }

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id} className="cart-dropdown-item">
          <span>{item.titulo}</span>
          <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
