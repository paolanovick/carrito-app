import React from "react";

const Navbar = ({ cartCount }) => {
  return (
    <nav>
      <div className="logo-container">
        <div className="logo-icon">
          <img
            src="/logo.png"
            alt="TripNow Logo"
          
          />
        </div>

        <h2>
          Trip<span className="logo-accent">Now!</span>
        </h2>
      </div>

      <ul>
        <li>Inicio</li>
        <li>Paquetes</li>
        <li>Contacto</li>
        <li className="cart-item">
          Carrito
          <span className={`cart-badge ${cartCount > 0 ? "has-items" : ""}`}>
            {cartCount || 0}
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
