import React, { useState } from "react";

const CheckoutForm = ({ cart }) => {
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Orden enviada:", { ...form, cart });
    alert("Gracias por tu compra!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Checkout</h3>
      <input
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="address"
        placeholder="Dirección"
        value={form.address}
        onChange={handleChange}
        required
      />
      <button type="submit">Enviar Orden</button>
    </form>
  );
};

export default CheckoutForm;
