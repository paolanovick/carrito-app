import React from "react";

const Cart = ({ cart, removeFromCart }) => {
  return (
    <div className="cart">
      <h3>Carrito de Compras</h3>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <p>
              <strong>{item.title}</strong>
            </p>
            <p>Precio: ${item.price.toLocaleString()}</p>
            <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
