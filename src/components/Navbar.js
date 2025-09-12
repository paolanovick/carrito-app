import React, { useState } from "react";

const Navbar = ({ cartItems, removeFromCart }) => {
  const [showCart, setShowCart] = useState(false);

  return (
    <nav>
      <div className="logo-container">
        <div className="logo-icon">
          <img src="/logo.png" alt="TripNow Logo" />
        </div>
        <h2>
          Trip<span className="logo-accent">Now!</span>
        </h2>
      </div>

      <ul>
        <li>Inicio</li>
        <li>Paquetes</li>
        <li>Contacto</li>
        <li className="cart-item" onClick={() => setShowCart(!showCart)}>
          Carrito
          <span
            className={`cart-badge ${cartItems.length > 0 ? "has-items" : ""}`}
          >
            {cartItems.length || 0}
          </span>
          {showCart && (
            <div className="cart-dropdown">
              {cartItems.length === 0 ? (
                <p>El carrito está vacío</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-dropdown-item">
                    <span>{item.titulo}</span>
                    <button onClick={() => removeFromCart(item.id)}>X</button>
                  </div>
                ))
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
