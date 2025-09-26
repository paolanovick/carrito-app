import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CarouselList from "./components/CarouselList";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import SearchBar from "./components/SearchBar";

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [resultsInfo, setResultsInfo] = useState({ results: 0, total: 0 });
  const [showAll, setShowAll] = useState(false);

  const API_BASE = process.env.REACT_APP_N8N_API_BASE; // Ej: https://ni-n8n.com

  if (!API_BASE) {
    console.error("Variable REACT_APP_N8N_API_BASE no definida");
  }

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/webhook/carouselList`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      const data = await res.json();
      const paquetes = data?.paquetes || [];

      const processedProducts = (
        Array.isArray(paquetes) ? paquetes : [paquetes]
      )
        .filter((p) => p && p.titulo)
        .map((p, index) => ({
          id: p.paquete_externo_id || `package-${index}`,
          titulo: p.titulo?.replace(/<[^>]*>/g, "").trim() || "Sin título",
          imagen_principal:
            p.imagen_principal || "https://via.placeholder.com/200",
          url: p.url?.trim() || "#",
          cant_noches: parseInt(p.cant_noches) || 0,
          doble_precio: parseFloat(p.doble_precio || p.precio || 0),
          destinoCiudad:
            p.destinos?.destino?.ciudad || p.ciudad || "Desconocido",
          destinoPais: p.destinos?.destino?.pais || p.pais || "Desconocido",
          rawData: p,
        }));

      setProducts(processedProducts);
      setResultsInfo({
        results: processedProducts.length,
        total: processedProducts.length,
      });
      setShowAll(false);

      const processedImages = processedProducts.slice(0, 7).map((p, index) => ({
        id: p.id,
        url: p.imagen_principal,
        titulo: p.titulo,
        descripcion: "",
        alt: p.titulo,
      }));
      setImages(processedImages);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError(`Error al cargar productos: ${err.message}`);
      setProducts([]);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/webhook/search?${new URLSearchParams(
        filters
      ).toString()}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      const data = await res.json();
      const paquetes = data?.paquetes || [];

      let filtered = Array.isArray(paquetes) ? paquetes : [paquetes];

      // Filtros adicionales del lado cliente
      if (filters.destino) {
        const destinoBuscado = filters.destino.toLowerCase();
        filtered = filtered.filter((p) => {
          const destinos = p.destinos?.destino;
          if (!destinos) return false;
          if (Array.isArray(destinos)) {
            return destinos.some(
              (d) =>
                (d.ciudad || "").toLowerCase().includes(destinoBuscado) ||
                (d.pais || "").toLowerCase().includes(destinoBuscado)
            );
          } else {
            return (
              (destinos.ciudad || "").toLowerCase().includes(destinoBuscado) ||
              (destinos.pais || "").toLowerCase().includes(destinoBuscado)
            );
          }
        });
      }

      if (filters.salida) {
        const salidaBuscada = filters.salida.toLowerCase();
        filtered = filtered.filter((p) =>
          (p.origen || "").toLowerCase().includes(salidaBuscada)
        );
      }

      if (filters.fecha) {
        const fechaBuscada = filters.fecha;
        filtered = filtered.filter((p) => {
          const salidas = p.salidas?.salida;
          if (!salidas) return false;
          if (Array.isArray(salidas)) {
            return salidas.some(
              (s) =>
                (s.fecha_desde || "").includes(fechaBuscada) ||
                (s.fecha_hasta || "").includes(fechaBuscada)
            );
          } else {
            return (
              (salidas.fecha_desde || "").includes(fechaBuscada) ||
              (salidas.fecha_hasta || "").includes(fechaBuscada)
            );
          }
        });
      }

      if (filters.precioMin)
        filtered = filtered.filter(
          (p) =>
            parseFloat(p.doble_precio || p.precio || 0) >=
            parseFloat(filters.precioMin)
        );
      if (filters.precioMax)
        filtered = filtered.filter(
          (p) =>
            parseFloat(p.doble_precio || p.precio || 0) <=
            parseFloat(filters.precioMax)
        );
      if (filters.duracionMin)
        filtered = filtered.filter(
          (p) => parseInt(p.cant_noches || 0) >= parseInt(filters.duracionMin)
        );
      if (filters.duracionMax)
        filtered = filtered.filter(
          (p) => parseInt(p.cant_noches || 0) <= parseInt(filters.duracionMax)
        );

      const processedProducts = filtered
        .filter((p) => p && p.titulo)
        .map((p, index) => ({
          id: p.paquete_externo_id || `package-${index}`,
          titulo: p.titulo?.replace(/<[^>]*>/g, "").trim() || "Sin título",
          imagen_principal:
            p.imagen_principal || "https://via.placeholder.com/200",
          url: p.url?.trim() || "#",
          cant_noches: parseInt(p.cant_noches) || 0,
          doble_precio: parseFloat(p.doble_precio || p.precio || 0),
          destinoCiudad:
            p.destinos?.destino?.ciudad || p.ciudad || "Desconocido",
          destinoPais: p.destinos?.destino?.pais || p.pais || "Desconocido",
          rawData: p,
        }));

      setProducts(processedProducts);
      setShowAll(true);

      if (processedProducts.length === 0) {
        setError("No se encontraron paquetes con los filtros aplicados.");
      }

      setResultsInfo({
        results: processedProducts.length,
        total: filtered.length,
      });
    } catch (err) {
      console.error("Error al buscar paquetes:", err);
      setError(`No se pudo realizar la búsqueda: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => fetchProducts();
  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

 useEffect(() => {
   fetchProducts();
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);


  if (loading)
    return (
      <div className="loading-container">
        <p>Cargando productos...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p style={{ whiteSpace: "pre-line" }}>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );

  return (
    <>
      <Navbar cart={cart} removeFromCart={removeFromCart} />
      <div id="inicio">
        <CarouselList images={images} />
      </div>
      <SearchBar
        onSearch={handleSearch}
        onReset={handleReset}
        resultsCount={resultsInfo.results}
        totalCount={resultsInfo.total}
      />
      <main id="paquetes" className="main-content">
        <ProductList
          products={showAll ? products : products.slice(0, 10)}
          addToCart={addToCart}
          onSelect={setSelectedProduct}
        />
        {products.length > 10 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {showAll ? "Ver menos" : "Ver más"}
            </button>
          </div>
        )}
      </main>
      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <footer id="contacto">
        <Footer />
      </footer>
    </>
  );
}

export default App;
