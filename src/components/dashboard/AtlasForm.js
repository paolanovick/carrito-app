import React, { useState } from "react";

const AtlasForm = ({ onNewPackage }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    imagen: "",
    destinoCiudad: "",
    destinoPais: "",
    noches: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // POST a tu endpoint de Atlas (n8n)
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api/atlas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Error al crear paquete Atlas");

      // Notificar al App.js que se agregó un nuevo paquete
      onNewPackage && onNewPackage();

      // Limpiar form
      setFormData({
        titulo: "",
        descripcion: "",
        precio: "",
        imagen: "",
        destinoCiudad: "",
        destinoPais: "",
        noches: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="atlas-form">
      <h3>Agregar Paquete Atlas</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        name="titulo"
        placeholder="Título"
        value={formData.titulo}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="descripcion"
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={formData.precio}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="imagen"
        placeholder="URL Imagen"
        value={formData.imagen}
        onChange={handleChange}
      />
      <input
        type="text"
        name="destinoCiudad"
        placeholder="Ciudad"
        value={formData.destinoCiudad}
        onChange={handleChange}
      />
      <input
        type="text"
        name="destinoPais"
        placeholder="País"
        value={formData.destinoPais}
        onChange={handleChange}
      />
      <input
        type="number"
        name="noches"
        placeholder="Cantidad de noches"
        value={formData.noches}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Agregar Paquete"}
      </button>
    </form>
  );
};

export default AtlasForm;
