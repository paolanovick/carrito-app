import { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";

const SearchBar = ({ onSearch, onReset }) => {
  const [activeTab, setActiveTab] = useState("paquetes");
  const [formData, setFormData] = useState({
    salida: "",
    destino: "",
    fecha: "",
    viajeros: "2 adultos",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ ...formData, tipo: activeTab });
  };

  const handleResetLocal = () => {
    setFormData({ salida: "", destino: "", fecha: "", viajeros: "2 adultos" });
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
        <div className="form-group">
          <label>
            <FaMapMarkerAlt /> Ciudad de Salida
          </label>
          <input
            type="text"
            name="salida"
            placeholder="Ej: Buenos Aires"
            value={formData.salida}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaMapMarkerAlt /> Ciudad de Destino
          </label>
          <input
            type="text"
            name="destino"
            placeholder="Ej: Madrid"
            value={formData.destino}
            onChange={handleChange}
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
            placeholder="Ej: 2 adultos"
            value={formData.viajeros}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-buscar">
            BUSCAR
          </button>
          <button
            type="button"
            onClick={handleResetLocal}
            className="btn-reset"
          >
            VER TODOS
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
