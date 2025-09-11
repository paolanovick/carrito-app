import React from "react";

const Navbar = ({ cartCount }) => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        background: "#1976d2",
        color: "#fff",
      }}
    >
      <h2>Travel Connect</h2>
      <ul style={{ display: "flex", listStyle: "none", gap: "15px" }}>
        <li>Inicio</li>
        <li>Paquetes</li>
        <li>Contacto</li>
        <li>Carrito ({cartCount})</li>
      </ul>
    </nav>
  );
};

export default Navbar;
