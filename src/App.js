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

  // ---------------------------
  // 1️⃣ Función para traer Atlas
  // ---------------------------
 const fetchAtlas = async (filters = {}) => {
   try {
     const res = await fetch(
       "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api/atlas",
       {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           origen: filters.salida || "",
           destino: filters.destino || "",
           fechaIda: filters.fecha || "",
         }),
       }
     );

     const text = await res.text(); // primero lo convertimos a texto
     if (!text) return []; // si viene vacío, devolvemos array vacío

     let data;
     try {
       data = JSON.parse(text);
     } catch (err) {
       console.error("Error parseando JSON Atlas:", err, text);
       return [];
     }

     const paquetesRaw = data?.WSProducto || [];
     const paquetesArray = Array.isArray(paquetesRaw)
       ? paquetesRaw
       : [paquetesRaw];

     return paquetesArray.map((paquete) => ({
       id: paquete.Codigo || `atlas-${Date.now()}`,
       titulo: (paquete.Descripcion || "Sin título")
         .replace(/<[^>]*>/g, "")
         .trim(),
       imagen_principal: paquete.Imagen || "https://via.placeholder.com/200",
       url: "#",
       cant_noches: parseInt(paquete.Noches || 0),
       doble_precio: parseFloat(paquete.Precio || 0),
       destinoCiudad: paquete.Ciudad || "Desconocido",
       destinoPais: paquete.Pais || "Desconocido",
       rawData: paquete,
     }));
   } catch (err) {
     console.error("Error cargando paquetes Atlas:", err);
     return [];
   }
 };


  // ---------------------------
  // 2️⃣ fetchProducts (AllSeason + Atlas)
  // ---------------------------
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // --- AllSeason (tu código original) ---
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        { method: "GET" }
      );
      const data = await res.json();

      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      const processedAllSeason = formatted
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
          proveedor: "ALLSEASON",
        }));

      // --- Atlas ---
      const processedAtlas = await fetchAtlas();

      // --- Combinar ambos ---
      const combinedProducts = [...processedAllSeason, ...processedAtlas];

      setProducts(combinedProducts);
      setResultsInfo({
        results: combinedProducts.length,
        total: combinedProducts.length,
      });

      // Carousel (tomar las primeras 7 imágenes)
      const processedImages = combinedProducts
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

  // ---------------------------
  // 3️⃣ handleSearch (AllSeason + Atlas)
  // ---------------------------
  const handleSearch = async (filters) => {
    console.log("🔍 USANDO FILTRO COMPLETO EN REACT");
    console.log("Filtros aplicados:", filters);
    setLoading(true);
    setError(null);

    try {
      // --- AllSeason ---
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            destino: filters.destino || "",
            fecha: filters.fecha || "",
            salida: filters.salida || "",
            viajeros: "2 adultos",
            tipo: "paquetes",
            buscar: true,
          }),
        }
      );

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();

      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      // --- Aplicar filtros AllSeason ---
      let paquetesFiltrados = formatted;
      if (filters.destino) {
        const destinoBuscado = filters.destino.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((p) => {
          const destinos = p.destinos?.destino;
          if (!destinos) return false;
          if (Array.isArray(destinos)) {
            return destinos.some(
              (d) =>
                (d.ciudad || "").toLowerCase().includes(destinoBuscado) ||
                (d.pais || "").toLowerCase().includes(destinoBuscado)
            );
          } else {
            const ciudad = (destinos.ciudad || "").toLowerCase();
            const pais = (destinos.pais || "").toLowerCase();
            return (
              ciudad.includes(destinoBuscado) || pais.includes(destinoBuscado)
            );
          }
        });
      }
      if (filters.salida) {
        const salidaBuscada = filters.salida.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((p) =>
          (p.origen || "").toLowerCase().includes(salidaBuscada)
        );
      }
      if (filters.fecha) {
        const fechaBuscada = filters.fecha;
        paquetesFiltrados = paquetesFiltrados.filter((p) => {
          const salidas = p.salidas?.salida;
          if (!salidas) return false;
          if (Array.isArray(salidas)) {
            return salidas.some(
              (s) =>
                (s.fecha_desde || "").includes(fechaBuscada) ||
                (s.fecha_hasta || "").includes(fechaBuscada)
            );
          } else {
            const s = salidas;
            return (
              (s.fecha_desde || "").includes(fechaBuscada) ||
              (s.fecha_hasta || "").includes(fechaBuscada)
            );
          }
        });
      }
      // Filtros de precio y duración
      if (filters.precioMin)
        paquetesFiltrados = paquetesFiltrados.filter(
          (p) =>
            parseFloat(p.doble_precio || 0) >= parseFloat(filters.precioMin)
        );
      if (filters.precioMax)
        paquetesFiltrados = paquetesFiltrados.filter(
          (p) =>
            parseFloat(p.doble_precio || 0) <= parseFloat(filters.precioMax)
        );
      if (filters.duracionMin)
        paquetesFiltrados = paquetesFiltrados.filter(
          (p) => parseInt(p.cant_noches || 0) >= parseInt(filters.duracionMin)
        );
      if (filters.duracionMax)
        paquetesFiltrados = paquetesFiltrados.filter(
          (p) => parseInt(p.cant_noches || 0) <= parseInt(filters.duracionMax)
        );

      const processedAllSeason = paquetesFiltrados
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
          proveedor: "ALLSEASON",
        }));

      // --- Atlas con filtros ---
      const processedAtlas = await fetchAtlas(filters);

      // --- Combinar ---
      const combinedProducts = [...processedAllSeason, ...processedAtlas];

      setProducts(combinedProducts);
      setResultsInfo({
        results: combinedProducts.length,
        total: combinedProducts.length,
      });

      const processedImages = combinedProducts
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
      setShowAll(true);

      if (combinedProducts.length === 0) {
        setError(
          "No se encontraron paquetes disponibles con los filtros aplicados."
        );
      }
    } catch (err) {
      console.error("Error al buscar paquetes:", err);
      setError(`No se pudo realizar la búsqueda: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 4️⃣ Reset
  // ---------------------------
  const handleReset = async () => {
    await fetchProducts();
  };

  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

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
      <footer id="contacto">
        <Footer />
      </footer>
    </>
  );
}

export default App;
