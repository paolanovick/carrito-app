import { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState("paquetes");
  const [formData, setFormData] = useState({
    salida: "",
    destino: "",
    fecha: "",
    viajeros: "2 adultos",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ ...formData, tipo: activeTab });
  };

  return (
    <div className="searchbar-container">
      {/* Tabs */}
      <div className="tabs">
        {["paquetes", "vuelos", "hoteles", "autos", "circuitos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>
            <FaMapMarkerAlt /> Ciudad de Salida
          </label>
          <input
            type="text"
            name="salida"
            value={formData.salida}
            onChange={handleChange}
            placeholder="Seleccionar"
          />
        </div>

        <div className="form-group">
          <label>
            <FaMapMarkerAlt /> Ciudad de Destino
          </label>
          <input
            type="text"
            name="destino"
            value={formData.destino}
            onChange={handleChange}
            placeholder="Seleccionar"
          />
        </div>

        <div className="form-group">
          <label>
            <FaCalendarAlt /> Fecha de Salida
          </label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaUsers /> Viajeros
          </label>
          <input
            type="text"
            name="viajeros"
            value={formData.viajeros}
            onChange={handleChange}
          />
        </div>

        <div className="btn-container">
          <button type="submit" className="btn-buscar">
            BUSCAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
