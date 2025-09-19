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

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        {
          method: "GET",
        }
      );

      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);

      let data = {};
      const text = await res.text();
      if (text) {
        data = JSON.parse(text);
      } else {
        throw new Error("Respuesta vacía del servidor.");
      }

      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      const processedProducts = formatted
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

      const processedImages = formatted
        .filter((p) => p && p.imagen_principal)
        .slice(0, 7)
        .map((p, index) => ({
          id: p.paquete_externo_id || `image-${index}`,
          url: p.imagen_principal,
          titulo:
            p.titulo?.replace(/<[^>]*>/g, "").trim() || `Imagen ${index + 1}`,
          descripcion: "",
          alt:
            p.titulo?.replace(/<[^>]*>/g, "").trim() || `Imagen ${index + 1}`,
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
          body: JSON.stringify({
            destino: "",
            fecha: "",
            salida: "",
            viajeros: "2 adultos",
            tipo: "paquetes",
            buscar: false,
          }),
        }
      );

      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);

      let data = {};
      const text = await res.text();
      if (text) {
        data = JSON.parse(text);
      } else {
        throw new Error("Respuesta vacía del servidor.");
      }

      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];
      const totalCount = formatted.length;

      let paquetesFiltrados = formatted;

      if (filters.destino && filters.destino.trim() !== "") {
        const destinoBuscado = filters.destino.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const destinos = paquete.destinos?.destino;
          if (!destinos) return false;
          if (Array.isArray(destinos)) {
            return destinos.some(
              (dest) =>
                (dest.ciudad || "").toLowerCase().includes(destinoBuscado) ||
                (dest.pais || "").toLowerCase().includes(destinoBuscado)
            );
          } else {
            return (
              (destinos.ciudad || "").toLowerCase().includes(destinoBuscado) ||
              (destinos.pais || "").toLowerCase().includes(destinoBuscado)
            );
          }
        });
      }

      if (filters.salida && filters.salida.trim() !== "") {
        const salidaBuscada = filters.salida.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((paquete) =>
          (paquete.origen || "").toLowerCase().includes(salidaBuscada)
        );
      }

      if (filters.fecha && filters.fecha.trim() !== "") {
        const fechaBuscada = filters.fecha;
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const salidas = paquete.salidas?.salida;
          if (!salidas) return false;
          if (Array.isArray(salidas)) {
            return salidas.some(
              (salida) =>
                (salida.fecha_desde || "").includes(fechaBuscada) ||
                (salida.fecha_hasta || "").includes(fechaBuscada)
            );
          } else {
            return (
              (salidas.fecha_desde || "").includes(fechaBuscada) ||
              (salidas.fecha_hasta || "").includes(fechaBuscada)
            );
          }
        });
      }

      if (filters.precioMin && filters.precioMin.trim() !== "") {
        const precioMin = parseFloat(filters.precioMin);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const precio = parseFloat(paquete.doble_precio || 0);
          return precio >= precioMin;
        });
      }

      if (filters.precioMax && filters.precioMax.trim() !== "") {
        const precioMax = parseFloat(filters.precioMax);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const precio = parseFloat(paquete.doble_precio || 0);
          return precio <= precioMax;
        });
      }

      if (filters.duracionMin && filters.duracionMin.trim() !== "") {
        const duracionMin = parseInt(filters.duracionMin);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const noches = parseInt(paquete.cant_noches || 0);
          return noches >= duracionMin;
        });
      }

      if (filters.duracionMax && filters.duracionMax.trim() !== "") {
        const duracionMax = parseInt(filters.duracionMax);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const noches = parseInt(paquete.cant_noches || 0);
          return noches <= duracionMax;
        });
      }

      const resultsCount = paquetesFiltrados.length;

      setResultsInfo({ results: resultsCount, total: totalCount });

      const processedProducts = paquetesFiltrados
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
        const activeFilters = Object.entries(filters)
          .filter(
            ([key, value]) => value && value.trim() !== "" && key !== "tipo"
          )
          .map(([key, value]) => {
            const filterNames = {
              destino: "Destino",
              salida: "Salida",
              fecha: "Fecha",
              precioMin: "Precio mínimo",
              precioMax: "Precio máximo",
              duracionMin: "Duración mínima",
              duracionMax: "Duración máxima",
            };
            return `${filterNames[key] || key}: ${value}`;
          });

        setError(
          `No se encontraron paquetes con los filtros aplicados:\n\n${activeFilters.join(
            "\n"
          )}\n\nAjusta o elimina algunos filtros para ver más resultados.`
        );
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
