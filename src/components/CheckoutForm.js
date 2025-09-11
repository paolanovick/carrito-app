import React, { useState } from "react";

const CheckoutForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Compra completada!\nNombre: ${name}\nEmail: ${email}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h3>Checkout</h3>
      <input
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          display: "block",
          marginBottom: "10px",
          width: "100%",
          padding: "5px",
        }}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          marginBottom: "10px",
          width: "100%",
          padding: "5px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "5px 10px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Comprar
      </button>
    </form>
  );
};

export default CheckoutForm;
