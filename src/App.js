import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CarouselList from "./components/CarouselList";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import SearchBar from "./components/SearchBar";
import AtlasForm from "./components/dashboard/AtlasForm"; // <-- Importa el form

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [resultsInfo, setResultsInfo] = useState({ results: 0, total: 0 });
  const [showAll, setShowAll] = useState(false);

  // 🔹 Cargar productos al inicio (AllSeason + Atlas vía n8n)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        { method: "GET" }
      );
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      const processedProducts = formatted
        .filter((p) => p && (p.titulo || p.nombre))
        .map((p, index) => ({
          id: p.paquete_externo_id || p.codigo || `package-${index}`,
          titulo:
            p.titulo?.replace(/<[^>]*>/g, "").trim() ||
            p.nombre ||
            "Sin título",
          imagen_principal:
            p.imagen_principal || p.imagen || "https://via.placeholder.com/200",
          url: p.url?.trim() || "#",
          cant_noches: parseInt(p.cant_noches || p.noches || 0),
          doble_precio: parseFloat(p.doble_precio || p.precio || 0),
          destinoCiudad:
            p.destinos?.destino?.ciudad || p.destinoCiudad || "Desconocido",
          destinoPais:
            p.destinos?.destino?.pais || p.destinoPais || "Desconocido",
          proveedor: p.proveedor || "DESCONOCIDO",
          rawData: p,
        }));

      setProducts(processedProducts);
      setResultsInfo({
        results: processedProducts.length,
        total: processedProducts.length,
      });

      const processedImages = processedProducts
        .filter((p) => p && p.imagen_principal)
        .slice(0, 7)
        .map((p, index) => ({
          id: p.id || `image-${index}`,
          url: p.imagen_principal,
          titulo: p.titulo,
          descripcion: "",
          alt: p.titulo,
        }));

      setImages(processedImages);
      setShowAll(false);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError(`Error al cargar productos: ${err.message}`);
      setProducts([]);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 Función de búsqueda con todos los filtros
  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(filters),
        }
      );

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      const processedProducts = formatted
        .filter((p) => p && (p.titulo || p.nombre))
        .map((p, index) => ({
          id: p.paquete_externo_id || p.codigo || `package-${index}`,
          titulo:
            p.titulo?.replace(/<[^>]*>/g, "").trim() ||
            p.nombre ||
            "Sin título",
          imagen_principal:
            p.imagen_principal || p.imagen || "https://via.placeholder.com/200",
          url: p.url?.trim() || "#",
          cant_noches: parseInt(p.cant_noches || p.noches || 0),
          doble_precio: parseFloat(p.doble_precio || p.precio || 0),
          destinoCiudad:
            p.destinos?.destino?.ciudad || p.destinoCiudad || "Desconocido",
          destinoPais:
            p.destinos?.destino?.pais || p.destinoPais || "Desconocido",
          proveedor: p.proveedor || "DESCONOCIDO",
          rawData: p,
        }));

      setProducts(processedProducts);
      setResultsInfo({
        results: processedProducts.length,
        total: processedProducts.length,
      });
      setShowAll(true);

      const processedImages = processedProducts
        .filter((p) => p && p.imagen_principal)
        .slice(0, 7)
        .map((p, index) => ({
          id: p.id || `image-${index}`,
          url: p.imagen_principal,
          titulo: p.titulo,
          descripcion: "",
          alt: p.titulo,
        }));

      setImages(processedImages);

      if (processedProducts.length === 0) {
        setError("No se encontraron paquetes con los filtros aplicados.");
      }
    } catch (err) {
      console.error("Error al buscar paquetes:", err);
      setError(`No se pudo realizar la búsqueda: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    await fetchProducts();
  };

  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  // 🔹 Función para agregar paquete desde el AtlasForm
  const handleNewPackage = (newPackage) => {
    setProducts((prev) => [newPackage, ...prev]);
  };

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
          onSelect={(product) => setSelectedProduct(product)}
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

      {/* 🔹 Dashboard para agregar paquetes */}
      <div
        id="dashboard"
        style={{ padding: "20px", backgroundColor: "#f5f5f5" }}
      >
        <h2>Dashboard de Administración</h2>
        <AtlasForm onNewPackage={handleNewPackage} />
      </div>

      <footer id="contacto">
        <Footer />
      </footer>
    </>
  );
}

export default App;
