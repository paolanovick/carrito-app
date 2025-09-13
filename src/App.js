import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import Carrusel from "./components/Carrusel";
import "./index.css";

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://2cd882428218.ngrok-free.app/webhook/api",
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Datos recibidos:", data); // Para debug

        // Verificar la estructura de datos
        const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
        const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

        const processedProducts = formatted
          .filter((p) => p && p.titulo) // Filtrar paquetes válidos
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
          }));

        setProducts(processedProducts);
        setError(null);
        console.log("Productos procesados:", processedProducts);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setError(`Error al cargar productos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <>
      <Navbar cart={cart} removeFromCart={removeFromCart} />
      <Banner products={products} />

      {/* Carrusel dinámico usando las imágenes de los productos cargados */}
      <Carrusel
        images={products
          .map((p) => p.imagen_principal)
          .filter((img) => img && img !== "https://via.placeholder.com/200")}
      />

      <main className="main-content">
        <ProductList products={products} addToCart={addToCart} />
      </main>

      <Footer />
    </>
  );
}

export default App;
