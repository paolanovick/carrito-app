import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";

const SearchBar = ({ onSearch, onReset, resultsCount, totalCount }) => {
  const [activeTab, setActiveTab] = useState("paquetes");
  const [formData, setFormData] = useState({
    salida: "",
    destino: "",
    fecha: "",
    viajeros: "2 adultos",
    precioMin: "",
    precioMax: "",
    duracionMin: "",
    duracionMax: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ ...formData, tipo: activeTab });
  };

  const handleResetLocal = () => {
    setFormData({
      salida: "",
      destino: "",
      fecha: "",
      viajeros: "2 adultos",
      precioMin: "",
      precioMax: "",
      duracionMin: "",
      duracionMax: "",
    });
    if (onReset) onReset();
  };

  return (
    <div className="searchbar-wrapper">
      <div className="searchbar-tabs">
        {["Paquetes", "Vuelos", "Hoteles", "Autos", "Circuitos"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${
              activeTab === tab.toLowerCase() ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      

      <form onSubmit={handleSubmit} className="searchbar-form">
        {/* Filtros principales */}
        <div className="form-group">
          <label htmlFor="salida">
            <FaMapMarkerAlt /> Ciudad de Salida
          </label>
          <input
            type="text"
            name="salida"
            id="salida"
            placeholder="Ej: Buenos Aires"
            value={formData.salida}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="destino">
            <FaMapMarkerAlt /> Ciudad de Destino
          </label>
          <input
            type="text"
            name="destino"
            id="destino"
            placeholder="Ej: Madrid"
            value={formData.destino}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha">
            <FaCalendarAlt /> Fecha de Salida
          </label>
          <input
            type="date"
            name="fecha"
            id="fecha"
            value={formData.fecha}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="viajeros">
            <FaUsers /> Viajeros
          </label>
          <input
            type="text"
            name="viajeros"
            id="viajeros"
            placeholder="Ej: 2 adultos"
            value={formData.viajeros}
            onChange={handleChange}
          />
        </div>

        {/* Filtros de precio */}
        <div className="form-group">
          <label htmlFor="precioMin">
            <FaDollarSign /> Precio Mínimo
          </label>
          <input
            type="number"
            name="precioMin"
            id="precioMin"
            placeholder="$ 0"
            min="0"
            value={formData.precioMin}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="precioMax">
            <FaDollarSign /> Precio Máximo
          </label>
          <input
            type="number"
            name="precioMax"
            id="precioMax"
            placeholder="$ 999999"
            min="0"
            value={formData.precioMax}
            onChange={handleChange}
          />
        </div>

        {/* Filtros de duración */}
        <div className="form-group">
          <label htmlFor="duracionMin">
            <FaClock /> Mín. Noches
          </label>
          <input
            type="number"
            name="duracionMin"
            id="duracionMin"
            placeholder="1"
            min="1"
            value={formData.duracionMin}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duracionMax">
            <FaClock /> Máx. Noches
          </label>
          <input
            type="number"
            name="duracionMax"
            id="duracionMax"
            placeholder="30"
            min="1"
            value={formData.duracionMax}
            onChange={handleChange}
          />
        </div>

        {/* Botones mejorados */}
        <div className="button-group">
          <button type="submit" className="btn-buscar">
            BUSCAR PAQUETES
          </button>
          <button
            type="button"
            onClick={handleResetLocal}
            className="btn-reset"
          >
            LIMPIAR FILTROS
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
