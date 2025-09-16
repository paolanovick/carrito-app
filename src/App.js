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

  // 🔍 Función de búsqueda con filtro EN REACT (solución temporal)
  const handleSearch = async (filters) => {
    console.log("🔍 USANDO FILTRO EN REACT (temporal)");
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
            destino: "", // Enviar vacío para obtener todos
            fecha: "",
            salida: "",
            viajeros: "2 adultos",
            tipo: "paquetes",
            buscar: false, // No buscar, solo obtener todos
          }),
        }
      );

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      console.log("Datos recibidos del servidor:", data);

      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      console.log("🔍 Total de paquetes antes del filtro:", formatted.length);

      // 2. FILTRAR EN REACT
      let paquetesFiltrados = formatted;

      // Filtro por destino
      if (filters.destino && filters.destino.trim() !== "") {
        const destinoBuscado = filters.destino.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          // Buscar en destinos
          const destinos = paquete.destinos?.destino;

          if (!destinos) return false;

          // Si destinos es un array
          if (Array.isArray(destinos)) {
            return destinos.some((dest) => {
              const ciudad = (dest.ciudad || "").toLowerCase();
              const pais = (dest.pais || "").toLowerCase();
              return (
                ciudad.includes(destinoBuscado) || pais.includes(destinoBuscado)
              );
            });
          }
          // Si destinos es un objeto único
          else {
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

      console.log(
        "🎯 RESULTADO FINAL:",
        paquetesFiltrados.length,
        "paquetes filtrados"
      );

      // 3. Procesar y mostrar SOLO los paquetes filtrados
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

      if (processedProducts.length === 0)
        setError("No se encontraron paquetes con los filtros seleccionados.");
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
      <Navbar cart={cart} removeFromCart={removeFromCart} />
      <CarouselList images={images} />
      <SearchBar onSearch={handleSearch} onReset={handleReset} />
      <main className="main-content">
        <ProductList
          products={products}
          addToCart={addToCart}
          onSelect={(product) => setSelectedProduct(product)}
        />
      </main>
      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <Footer />
    </>
  );
}

export default App;
