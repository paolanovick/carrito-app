import React, { useState } from "react";
import Cart from "./Cart";

const Navbar = ({ cart, removeFromCart }) => {
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
        <li>
          <a href="#inicio">Inicio</a>
        </li>
        <li>
          <a href="#paquetes">Paquetes</a>
        </li>
        <li>
          <a href="#contacto">Contacto</a>
        </li>
        <li className="cart-item" onClick={() => setShowCart((prev) => !prev)}>
          Carrito
          <span className={`cart-badge ${cart.length > 0 ? "has-items" : ""}`}>
            {cart.length || 0}
          </span>
          {showCart && (
            <div className="cart-dropdown">
              <Cart cart={cart} removeFromCart={removeFromCart} />
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
