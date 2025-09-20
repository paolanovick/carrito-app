import React, { useState } from "react";
import { FaSave, FaTimes, FaEye } from "react-icons/fa";

const AtlasForm = ({ onNewPackage, onClose, editPackage = null }) => {
  const [formData, setFormData] = useState({
    titulo: editPackage?.titulo || "",
    descripcion: editPackage?.descripcion || "",
    precio: editPackage?.doble_precio || "",
    imagen: editPackage?.imagen_principal || "",
    destinoCiudad: editPackage?.destinoCiudad || "",
    destinoPais: editPackage?.destinoPais || "",
    noches: editPackage?.cant_noches || "",
    origen: editPackage?.origen || "Buenos Aires",
    incluye: editPackage?.incluye?.join(", ") || "",
    no_incluye: editPackage?.no_incluye?.join(", ") || "",
    disponible: editPackage?.disponible !== false,
    moneda: editPackage?.moneda || "USD",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(formData.imagen);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({ ...formData, [name]: newValue });

    // Preview de imagen
    if (name === "imagen" && value) {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.titulo.trim()) errors.push("El título es requerido");
    if (!formData.precio || formData.precio <= 0)
      errors.push("El precio debe ser mayor a 0");
    if (!formData.noches || formData.noches <= 0)
      errors.push("Las noches deben ser mayor a 0");
    if (!formData.destinoCiudad.trim())
      errors.push("La ciudad destino es requerida");
    if (!formData.destinoPais.trim())
      errors.push("El país destino es requerido");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validar formulario
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para Atlas API
      const atlasPayload = {
        // Datos del paquete
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        doble_precio: parseFloat(formData.precio),
        imagen_principal:
          formData.imagen.trim() || "https://via.placeholder.com/400x300",
        cant_noches: parseInt(formData.noches),

        // Destinos
        destinoCiudad: formData.destinoCiudad.trim(),
        destinoPais: formData.destinoPais.trim(),
        origen: formData.origen.trim(),

        // Listas
        incluye: formData.incluye
          ? formData.incluye
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item)
          : [],
        no_incluye: formData.no_incluye
          ? formData.no_incluye
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item)
          : [],

        // Estado
        disponible: formData.disponible,
        moneda: formData.moneda,

        // Metadata
        fecha_creacion: new Date().toISOString(),
        proveedor: "Atlas",

        // Si es edición, incluir ID
        ...(editPackage && {
          id: editPackage.paquete_externo_id || editPackage.id,
        }),
      };

      console.log("Enviando a Atlas:", atlasPayload);

      const url = editPackage
        ? "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/atlas-update"
        : "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/atlas-create";

      const method = editPackage ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(atlasPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      console.log("Respuesta de Atlas:", result);

      // Procesar resultado exitoso
      const processedPackage = {
        id: result.paquete_externo_id || result.id || `atlas-${Date.now()}`,
        titulo: result.titulo || formData.titulo,
        imagen_principal:
          result.imagen_principal ||
          formData.imagen ||
          "https://via.placeholder.com/400x300",
        cant_noches: parseInt(result.cant_noches || formData.noches),
        doble_precio: parseFloat(
          result.doble_precio || result.precio || formData.precio
        ),
        destinoCiudad: result.destinoCiudad || formData.destinoCiudad,
        destinoPais: result.destinoPais || formData.destinoPais,
        source: "Atlas",
        moneda: result.moneda || formData.moneda,
        disponible: result.disponible !== false,
        descripcion: result.descripcion || formData.descripcion,
        incluye: result.incluye || [],
        no_incluye: result.no_incluye || [],
        rawData: result,
      };

      // Notificar al componente padre
      if (onNewPackage) {
        onNewPackage(processedPackage);
      }

      setSuccess(true);

      // Si no es edición, limpiar formulario
      if (!editPackage) {
        setFormData({
          titulo: "",
          descripcion: "",
          precio: "",
          imagen: "",
          destinoCiudad: "",
          destinoPais: "",
          noches: "",
          origen: "Buenos Aires",
          incluye: "",
          no_incluye: "",
          disponible: true,
          moneda: "USD",
        });
        setImagePreview("");
      }

      // Cerrar modal después de 2 segundos
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Error al enviar a Atlas:", err);
      setError(
        `Error al ${editPackage ? "actualizar" : "crear"} paquete: ${
          err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="atlas-form-container">
      <div className="form-header">
        <h2>
          {editPackage ? "Editar Paquete Atlas" : "Crear Nuevo Paquete Atlas"}
        </h2>
        {onClose && (
          <button className="close-btn" onClick={onClose} type="button">
            <FaTimes />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="atlas-form">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <strong>¡Éxito!</strong> Paquete{" "}
            {editPackage ? "actualizado" : "creado"} correctamente
          </div>
        )}

        <div className="form-grid">
          {/* Información básica */}
          <div className="form-section">
            <h3>Información Básica</h3>

            <div className="form-group">
              <label htmlFor="titulo">Título *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Ej: Europa Clásica 15 días"
                value={formData.titulo}
                onChange={handleChange}
                required
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe el paquete, qué incluye, itinerario, etc."
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                maxLength="500"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio">Precio (USD) *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  placeholder="1500"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="noches">Noches *</label>
                <input
                  type="number"
                  id="noches"
                  name="noches"
                  placeholder="7"
                  value={formData.noches}
                  onChange={handleChange}
                  required
                  min="1"
                  max="365"
                />
              </div>

              <div className="form-group">
                <label htmlFor="moneda">Moneda</label>
                <select
                  id="moneda"
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Destinos */}
          <div className="form-section">
            <h3>Destinos</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="destinoCiudad">Ciudad Destino *</label>
                <input
                  type="text"
                  id="destinoCiudad"
                  name="destinoCiudad"
                  placeholder="París"
                  value={formData.destinoCiudad}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="destinoPais">País Destino *</label>
                <input
                  type="text"
                  id="destinoPais"
                  name="destinoPais"
                  placeholder="Francia"
                  value={formData.destinoPais}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="origen">Origen</label>
                <input
                  type="text"
                  id="origen"
                  name="origen"
                  placeholder="Buenos Aires"
                  value={formData.origen}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="form-section">
            <h3>Imagen</h3>

            <div className="form-group">
              <label htmlFor="imagen">URL de la imagen</label>
              <input
                type="url"
                id="imagen"
                name="imagen"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.imagen}
                onChange={handleChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => window.open(imagePreview, "_blank")}
                    className="preview-btn"
                  >
                    <FaEye /> Ver completa
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Incluye/No incluye */}
          <div className="form-section">
            <h3>Servicios</h3>

            <div className="form-group">
              <label htmlFor="incluye">Incluye (separado por comas)</label>
              <input
                type="text"
                id="incluye"
                name="incluye"
                placeholder="Vuelos, Hoteles 4*, Desayunos, Traslados"
                value={formData.incluye}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="no_incluye">
                No incluye (separado por comas)
              </label>
              <input
                type="text"
                id="no_incluye"
                name="no_incluye"
                placeholder="Almuerzos, Cenas, Excursiones opcionales"
                value={formData.no_incluye}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Estado */}
          <div className="form-section">
            <div className="form-group checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="disponible"
                  checked={formData.disponible}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Disponible para venta
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          {onClose && (
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>⏳ {editPackage ? "Actualizando..." : "Creando..."}</>
            ) : (
              <>
                <FaSave />{" "}
                {editPackage ? "Actualizar Paquete" : "Crear Paquete"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AtlasForm;
