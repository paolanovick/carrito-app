import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [tipo, setTipo] = useState("paquetes"); // paquetes | vuelos | hoteles
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [destino, setDestino] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ tipo, fechaDesde, fechaHasta, destino });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        margin: "20px auto",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "900px",
      }}
    >
      {/* Botones tipo */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={() => setTipo("paquetes")}
          style={{
            padding: "10px 20px",
            backgroundColor: tipo === "paquetes" ? "#007bff" : "#f1f1f1",
            color: tipo === "paquetes" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Paquetes
        </button>
        <button
          type="button"
          onClick={() => setTipo("vuelos")}
          style={{
            padding: "10px 20px",
            backgroundColor: tipo === "vuelos" ? "#007bff" : "#f1f1f1",
            color: tipo === "vuelos" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Vuelos
        </button>
        <button
          type="button"
          onClick={() => setTipo("hoteles")}
          style={{
            padding: "10px 20px",
            backgroundColor: tipo === "hoteles" ? "#007bff" : "#f1f1f1",
            color: tipo === "hoteles" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Hoteles
        </button>
      </div>

      {/* Fechas */}
      <input
        type="date"
        value={fechaDesde}
        onChange={(e) => setFechaDesde(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <input
        type="date"
        value={fechaHasta}
        onChange={(e) => setFechaHasta(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      {/* Destino */}
      <input
        type="text"
        placeholder="Destino..."
        value={destino}
        onChange={(e) => setDestino(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          minWidth: "200px",
        }}
      />

      {/* Botón buscar */}
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;
