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
    console.log("Datos antes de enviar:", formData);
    onSearch({ ...formData, tipo: activeTab });
  };

  const handleReset = () => {
    setFormData({
      salida: "",
      destino: "",
      fecha: "",
      viajeros: "2 adultos",
    });
    if (onReset) {
      onReset(); // Llamar función para mostrar todos los paquetes
    }
  };

  return (
    <>
      <div className="searchbar-wrapper">
        {/* Tabs */}
        <div className="searchbar-tabs">
          {["Paquetes", "Vuelos", "Hoteles", "Autos", "Circuitos"].map(
            (tab) => (
              <button
                key={tab}
                className={`tab-btn ${
                  activeTab === tab.toLowerCase() ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Formulario */}
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
            <button type="button" onClick={handleReset} className="btn-reset">
              VER TODOS
            </button>
          </div>
        </form>
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        .searchbar-wrapper {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 25px;
          margin: 20px auto;
          max-width: 1200px;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .searchbar-tabs {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 10px 20px;
          border: 2px solid #dee2e6;
          background: white;
          color: #6c757d;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .tab-btn:hover {
          border-color: #514628ff;
          color: #514628ff;
          transform: translateY(-2px);
        }

        .tab-btn.active {
          background: #514628ff;
          color: white;
          border-color: #514628ff;
          box-shadow: 0 4px 15px rgba(81, 70, 40, 0.3);
        }

        .searchbar-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #495057;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group label svg {
          color: #514628ff;
        }

        .form-group input {
          padding: 12px 15px;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #514628ff;
          box-shadow: 0 0 0 3px rgba(81, 70, 40, 0.1);
        }

        .form-group input::placeholder {
          color: #adb5bd;
        }

        .button-group {
          display: flex;
          gap: 10px;
          justify-content: center;
          grid-column: 1 / -1;
          margin-top: 10px;
        }

        .btn-buscar,
        .btn-reset {
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-buscar {
          background: linear-gradient(135deg, #514628ff, #6d5a32);
          color: white;
          box-shadow: 0 4px 15px rgba(81, 70, 40, 0.3);
        }

        .btn-buscar:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(81, 70, 40, 0.4);
        }

        .btn-reset {
          background: linear-gradient(135deg, #6c757d, #5a6268);
          color: white;
          box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
        }

        .btn-reset:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
        }

        @media (max-width: 768px) {
          .searchbar-wrapper {
            margin: 10px;
            padding: 20px 15px;
          }

          .searchbar-form {
            grid-template-columns: 1fr;
          }

          .searchbar-tabs {
            gap: 10px;
          }

          .tab-btn {
            padding: 8px 15px;
            font-size: 12px;
          }

          .button-group {
            flex-direction: column;
            gap: 10px;
          }

          .btn-buscar,
          .btn-reset {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .searchbar-tabs {
            flex-direction: column;
            align-items: center;
          }

          .tab-btn {
            width: 200px;
          }
        }
      `}</style>
    </>
  );
};

export default SearchBar;
