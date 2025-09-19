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
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false); // limpiar mensaje de éxito al editar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api/atlas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Error al enviar paquete a n8n");

      const createdPackage = await res.json();

      // Llamamos a la función de App.js para agregar el producto
      onNewPackage &&
        onNewPackage({
          id: createdPackage.paquete_externo_id || `package-${Date.now()}`,
          titulo: createdPackage.titulo || formData.titulo,
          imagen_principal:
            createdPackage.imagen ||
            formData.imagen ||
            "https://via.placeholder.com/200",
          cant_noches: parseInt(createdPackage.noches || formData.noches || 0),
          doble_precio: parseFloat(
            createdPackage.precio || formData.precio || 0
          ),
          destinoCiudad:
            createdPackage.destinoCiudad ||
            formData.destinoCiudad ||
            "Desconocido",
          destinoPais:
            createdPackage.destinoPais || formData.destinoPais || "Desconocido",
          proveedor: createdPackage.proveedor || "DESCONOCIDO",
          rawData: createdPackage,
        });

      setSuccess(true);
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
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="atlas-form">
      <h3>Agregar Paquete Atlas</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Paquete agregado correctamente!</p>
      )}

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
