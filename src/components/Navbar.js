import React, { useState } from "react";
import Cart from "./Cart";
import AtlasForm from "./dashboard/AtlasForm";

const Navbar = ({ cart, removeFromCart, addProductToList }) => {
  const [showCart, setShowCart] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

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

        {/* Carrito */}
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

        {/* Dashboard */}
        <li
          className="dashboard-item"
          onClick={() => setShowDashboard((prev) => !prev)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          Dashboard
          {showDashboard && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: "0",
                width: "400px",
                maxHeight: "80vh",
                overflowY: "auto",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                zIndex: 1000,
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AtlasForm onNewPackage={addProductToList} />
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
