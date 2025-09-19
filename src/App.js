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

  // Cargar productos al inicio
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        { method: "GET" }
      );
      const data = await res.json();
      console.log("Datos recibidos:", data);

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

  // 🔍 Función de búsqueda mejorada con todos los filtros
  const handleSearch = async (filters) => {
    console.log("🔍 USANDO FILTRO COMPLETO EN REACT");
    console.log("Filtros aplicados:", filters);
    setLoading(true);
    setError(null);

    try {
      // 1. Obtener TODOS los paquetes sin filtro
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

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];
      const totalCount = formatted.length;

      console.log("🔍 Total de paquetes antes del filtro:", totalCount);

      // 2. APLICAR TODOS LOS FILTROS
      let paquetesFiltrados = formatted;

      // Filtro por destino
      if (filters.destino && filters.destino.trim() !== "") {
        const destinoBuscado = filters.destino.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const destinos = paquete.destinos?.destino;
          if (!destinos) return false;

          if (Array.isArray(destinos)) {
            return destinos.some((dest) => {
              const ciudad = (dest.ciudad || "").toLowerCase();
              const pais = (dest.pais || "").toLowerCase();
              return (
                ciudad.includes(destinoBuscado) || pais.includes(destinoBuscado)
              );
            });
          } else {
            const ciudad = (destinos.ciudad || "").toLowerCase();
            const pais = (destinos.pais || "").toLowerCase();
            return (
              ciudad.includes(destinoBuscado) || pais.includes(destinoBuscado)
            );
          }
        });
        console.log(
          `✅ Filtro destino "${filters.destino}": ${paquetesFiltrados.length} paquetes`
        );
      }

      // Filtro por salida (origen)
      if (filters.salida && filters.salida.trim() !== "") {
        const salidaBuscada = filters.salida.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const origen = (paquete.origen || "").toLowerCase();
          return origen.includes(salidaBuscada);
        });
        console.log(
          `✅ Filtro salida "${filters.salida}": ${paquetesFiltrados.length} paquetes`
        );
      }

      // Filtro por fecha
      if (filters.fecha && filters.fecha.trim() !== "") {
        const fechaBuscada = filters.fecha;
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const salidas = paquete.salidas?.salida;
          if (!salidas) return false;

          if (Array.isArray(salidas)) {
            return salidas.some((salida) => {
              const fechaDesde = salida.fecha_desde || "";
              const fechaHasta = salida.fecha_hasta || "";
              return (
                fechaDesde.includes(fechaBuscada) ||
                fechaHasta.includes(fechaBuscada)
              );
            });
          } else {
            const fechaDesde = salidas.fecha_desde || "";
            const fechaHasta = salidas.fecha_hasta || "";
            return (
              fechaDesde.includes(fechaBuscada) ||
              fechaHasta.includes(fechaBuscada)
            );
          }
        });
        console.log(
          `✅ Filtro fecha "${filters.fecha}": ${paquetesFiltrados.length} paquetes`
        );
      }

      // 🆕 Filtro por precio mínimo
      if (filters.precioMin && filters.precioMin.trim() !== "") {
        const precioMin = parseFloat(filters.precioMin);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const precio = parseFloat(paquete.doble_precio || 0);
          return precio >= precioMin;
        });
        console.log(
          `✅ Filtro precio mínimo ${precioMin}: ${paquetesFiltrados.length} paquetes`
        );
      }

      // 🆕 Filtro por precio máximo
      if (filters.precioMax && filters.precioMax.trim() !== "") {
        const precioMax = parseFloat(filters.precioMax);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const precio = parseFloat(paquete.doble_precio || 0);
          return precio <= precioMax;
        });
        console.log(
          `✅ Filtro precio máximo ${precioMax}: ${paquetesFiltrados.length} paquetes`
        );
      }

      // 🆕 Filtro por duración mínima (noches)
      if (filters.duracionMin && filters.duracionMin.trim() !== "") {
        const duracionMin = parseInt(filters.duracionMin);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const noches = parseInt(paquete.cant_noches || 0);
          return noches >= duracionMin;
        });
        console.log(
          `✅ Filtro duración mínima ${duracionMin} noches: ${paquetesFiltrados.length} paquetes`
        );
      }

      // 🆕 Filtro por duración máxima (noches)
      if (filters.duracionMax && filters.duracionMax.trim() !== "") {
        const duracionMax = parseInt(filters.duracionMax);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const noches = parseInt(paquete.cant_noches || 0);
          return noches <= duracionMax;
        });
        console.log(
          `✅ Filtro duración máxima ${duracionMax} noches: ${paquetesFiltrados.length} paquetes`
        );
      }

      const resultsCount = paquetesFiltrados.length;
      console.log(
        "🎯 RESULTADO FINAL:",
        resultsCount,
        "de",
        totalCount,
        "paquetes"
      );

      // 3. Actualizar información de resultados
      setResultsInfo({ results: resultsCount, total: totalCount });

      // 4. Procesar productos filtrados
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
      // 5. Mensajes mejorados cuando no hay resultados
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

        if (activeFilters.length > 0) {
          setError(
            `No se encontraron paquetes que coincidan con los filtros aplicados:\n\n${activeFilters.join(
              "\n"
            )}\n\nIntenta ajustar o eliminar algunos filtros para ver más resultados.`
          );
        } else {
          setError("No se encontraron paquetes disponibles en este momento.");
        }
      }
    } catch (err) {
      console.error("Error al buscar paquetes:", err);
      setError(`No se pudo realizar la búsqueda: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Función reset para mostrar todos los paquetes
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
      {/* Navbar fija */}
      <Navbar cart={cart} removeFromCart={removeFromCart} />

      {/* Inicio */}
      <div id="inicio">
        <CarouselList images={images} />
      </div>

      <SearchBar
        onSearch={handleSearch}
        onReset={handleReset}
        resultsCount={resultsInfo.results}
        totalCount={resultsInfo.total}
      />

      {/* Paquetes */}
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

      {/* Modal producto */}
      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Footer */}
      <footer id="contacto">
        <Footer />
      </footer>
    </>
  );
}

export default App;
