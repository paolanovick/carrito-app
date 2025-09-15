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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
          {
            method: "GET",
          }
        );

        const data = await res.json();
        console.log("Datos recibidos:", data);

        const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
        const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

        const processedProducts = formatted
          .filter((p) => p && p.titulo)
          .map((p, index) => ({
            id: p.paquete_externo_id || `package-${index}`,
            titulo:
              p.titulo
                ?.replace(/<br>/g, " ")
                ?.replace(/<[^>]*>/g, "")
                ?.trim() || "Sin título",
            imagen_principal:
              p.imagen_principal || "https://via.placeholder.com/200",
            url: p.url?.trim() || "#",
            cant_noches: parseInt(p.cant_noches) || 0,
            doble_precio: parseFloat(
              p.doble_precio ||
                p.salidas?.salida?.[0]?.doble_precio ||
                p.precio ||
                0
            ),
            destinoCiudad:
              p.destinos?.destino?.ciudad ||
              (Array.isArray(p.destinos?.destino)
                ? p.destinos.destino[0]?.ciudad
                : null) ||
              p.ciudad ||
              "Desconocido",
            destinoPais:
              p.destinos?.destino?.pais ||
              (Array.isArray(p.destinos?.destino)
                ? p.destinos.destino[0]?.pais
                : null) ||
              p.pais ||
              "Desconocido",
            rawData: p,
          }));

        console.log("Productos procesados:", processedProducts);
        setProducts(processedProducts);
        setError(null);

        // Procesar imágenes carrusel
        const processedImages = formatted
          .filter((p) => p && p.imagen_principal)
          .slice(0, 7)
          .map((p, index) => ({
            id: p.paquete_externo_id || `image-${index}`,
            url: p.imagen_principal,
            titulo:
              p.titulo
                ?.replace(/<br>/g, " ")
                ?.replace(/<[^>]*>/g, "")
                ?.trim() || `Imagen ${index + 1}`,
            descripcion: "",
            alt:
              p.titulo
                ?.replace(/<br>/g, " ")
                ?.replace(/<[^>]*>/g, "")
                ?.trim() || `Imagen ${index + 1}`,
          }));

        console.log("Imágenes del carrusel procesadas:", processedImages);
        setImages(processedImages);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setError(`Error al cargar productos: ${err.message}`);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔥 FUNCIÓN DE BÚSQUEDA CORREGIDA
  const handleSearch = async (filters) => {
    console.log("Filtros aplicados:", filters);
    setLoading(true);
    setError(null);

    try {
      // 👈 CAMBIO PRINCIPAL: URL del endpoint de búsqueda
      const response = await fetch(
        "http://167.172.31.249:5678/webhook/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        }
      );

      if (!response.ok) throw new Error("Error al buscar en n8n");

      const data = await response.json();

      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      const processedProducts = formatted
        .filter((p) => p && p.titulo)
        .map((p, index) => ({
          id: p.paquete_externo_id || `package-${index}`,
          titulo:
            p.titulo
              ?.replace(/<br>/g, " ")
              ?.replace(/<[^>]*>/g, "")
              ?.trim() || "Sin título",
          imagen_principal:
            p.imagen_principal || "https://via.placeholder.com/200",
          url: p.url?.trim() || "#",
          cant_noches: parseInt(p.cant_noches) || 0,
          doble_precio: parseFloat(
            p.doble_precio ||
              p.salidas?.salida?.[0]?.doble_precio ||
              p.precio ||
              0
          ),
          destinoCiudad:
            p.destinos?.destino?.ciudad ||
            (Array.isArray(p.destinos?.destino)
              ? p.destinos.destino[0]?.ciudad
              : null) ||
            p.ciudad ||
            "Desconocido",
          destinoPais:
            p.destinos?.destino?.pais ||
            (Array.isArray(p.destinos?.destino)
              ? p.destinos.destino[0]?.pais
              : null) ||
            p.pais ||
            "Desconocido",
          rawData: p,
        }));

      setProducts(processedProducts);
    } catch (err) {
      console.error("Error al buscar paquetes:", err);
      setError("No se pudieron obtener los resultados. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 NUEVA FUNCIÓN PARA VOLVER A MOSTRAR TODOS LOS PAQUETES
  const handleReset = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        {
          method: "GET",
        }
      );

      const data = await res.json();
      console.log("Datos recibidos:", data);

      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      const processedProducts = formatted
        .filter((p) => p && p.titulo)
        .map((p, index) => ({
          id: p.paquete_externo_id || `package-${index}`,
          titulo:
            p.titulo
              ?.replace(/<br>/g, " ")
              ?.replace(/<[^>]*>/g, "")
              ?.trim() || "Sin título",
          imagen_principal:
            p.imagen_principal || "https://via.placeholder.com/200",
          url: p.url?.trim() || "#",
          cant_noches: parseInt(p.cant_noches) || 0,
          doble_precio: parseFloat(
            p.doble_precio ||
              p.salidas?.salida?.[0]?.doble_precio ||
              p.precio ||
              0
          ),
          destinoCiudad:
            p.destinos?.destino?.ciudad ||
            (Array.isArray(p.destinos?.destino)
              ? p.destinos.destino[0]?.ciudad
              : null) ||
            p.ciudad ||
            "Desconocido",
          destinoPais:
            p.destinos?.destino?.pais ||
            (Array.isArray(p.destinos?.destino)
              ? p.destinos.destino[0]?.pais
              : null) ||
            p.pais ||
            "Desconocido",
          rawData: p,
        }));

      setProducts(processedProducts);
      setError(null);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError(`Error al cargar productos: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );

  return (
    <>
      <Navbar cart={cart} removeFromCart={removeFromCart} />
      <CarouselList images={images} />

      {/* 🔍 Buscador con función de reset */}
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
