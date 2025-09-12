import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";

import Footer from "./components/Footer";
import "./index.css";

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://ff910aaa68e6.ngrok-free.app/webhook/api",
          { headers: { "ngrok-skip-browser-warning": "true" } }
        );
        const data = await response.json();
        const paquetes = data?.root?.paquetes?.paquete;
        const paquetesArray = Array.isArray(paquetes)
          ? paquetes
          : paquetes
          ? [paquetes]
          : [];

        const formatted = paquetesArray.map((p, index) => ({
          id: p.paquete_externo_id || index,
          titulo: p.titulo ? p.titulo.replace(/<br>/g, " ") : "Sin título",
          url: p.url?.trim() || "#",
          imagen_principal:
            p.imagen_principal || "https://via.placeholder.com/200",
          cant_noches: p.cant_noches || 0,
          doble_precio: p.salidas?.salida?.[0]?.doble_precio || 0,
          destinoCiudad: p.destinos?.destino?.ciudad || "Desconocido",
          destinoPais: p.destinos?.destino?.pais || "Desconocido",
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((item) => item.id !== productId));

  return (
    <div>
      <Navbar cartItems={cart} removeFromCart={removeFromCart} />
      <Banner products={products} />
      <main>
        <ProductList products={products} addToCart={addToCart} />
        {/* Quitamos la sección fija del carrito */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
