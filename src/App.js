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

  useEffect(() => {
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

    fetchProducts();
  }, []); // vacío para que corra solo una vez

  // Función para buscar con filtros
  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];
      const totalCount = formatted.length;

      // Aplica filtros como en tu código
      let paquetesFiltrados = formatted;

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
      }

      if (filters.salida && filters.salida.trim() !== "") {
        const salidaBuscada = filters.salida.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const origen = (paquete.origen || "").toLowerCase();
          return origen.includes(salidaBuscada);
        });
      }

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

  // Reset para mostrar todos los paquetes sin filtros
  const handleReset = async () => {
    setShowAll(false);
    setError(null);
    setLoading(true);
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
    } catch (err) {
      setError(`Error al resetear la búsqueda: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Navbar cart={cart} />
      <CarouselList images={images} />
      <SearchBar onSearch={handleSearch} onReset={handleReset} />
      {loading && <p>Cargando productos...</p>}
      {error && (
        <div
          style={{ backgroundColor: "#faa", padding: "1em", margin: "1em 0" }}
        >
          <strong>{error}</strong>
        </div>
      )}
      {!loading && !error && (
        <>
          <p>
            Mostrando {resultsInfo.results} resultados de un total de{" "}
            {resultsInfo.total}
          </p>
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
          />
        </>
      )}
      {selectedProduct && (
        <Modal product={selectedProduct} onClose={handleCloseModal} />
      )}
      <Footer />
    </>
  );
}

export default App;
