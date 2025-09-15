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

  // 🔥 FUNCIÓN DE BÚSQUEDA CORREGIDA CON MANEJO ROBUSTO DE ERRORES
  const handleSearch = async (filters) => {
    console.log("Datos antes de enviar:", filters);
    console.log("Filtros aplicados:", filters);

    setLoading(true);
    setError(null);

    try {
      // 1. Configuración robusta con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

      // 2. Intentar con POST primero
      const response = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...filters,
            buscar: true, // Parámetro para indicar que es búsqueda
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("Respuesta de búsqueda:", data);

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

      if (processedProducts.length === 0) {
        setError("No se encontraron paquetes con los filtros seleccionados.");
      }
    } catch (error) {
      console.error("Error al buscar paquetes:", error);

      // 3. Intentar método alternativo con GET
      try {
        console.log("Intentando método alternativo...");

        const params = new URLSearchParams({
          destino: filters.destino || "",
          fecha: filters.fecha || "",
          salida: filters.salida || "",
          viajeros: filters.viajeros || "2 adultos",
          buscar: "true",
        });

        const fallbackResponse = await fetch(
          `https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api?${params}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log("Respuesta con método alternativo:", fallbackData);

          // Procesar con la misma lógica
          const paquetes =
            fallbackData?.root?.paquetes?.paquete ||
            fallbackData?.paquetes ||
            [];
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
          return; // Salir exitosamente
        }
      } catch (fallbackError) {
        console.error("Método alternativo también falló:", fallbackError);
      }

      // 4. Si ambos métodos fallan, mostrar error descriptivo
      let errorMessage = "Error al realizar la búsqueda";

      if (error.name === "AbortError") {
        errorMessage = "La búsqueda tardó demasiado. Intenta nuevamente.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "No se pudo conectar al servidor. Verifica tu conexión a internet y que el servicio esté disponible.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      setError(errorMessage);
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
        <p style={{ whiteSpace: "pre-line" }}>{error}</p>
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
