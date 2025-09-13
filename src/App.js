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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          " https://2cd882428218.ngrok-free.app/webhook/api",
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        const data = await res.json();
        const paquetes = data?.root?.paquetes?.paquete || [];
        const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];
        setProducts(
          formatted.map((p, index) => ({
            id: p.paquete_externo_id || index,
            titulo: p.titulo?.replace(/<br>/g, " ") || "Sin título",
            imagen_principal:
              p.imagen_principal || "https://via.placeholder.com/200",
            url: p.url?.trim() || "#",
            cant_noches: p.cant_noches || 0,
            doble_precio: p.salidas?.salida?.[0]?.doble_precio || 0,
            destinoCiudad: p.destinos?.destino?.ciudad || "Desconocido",
            destinoPais: p.destinos?.destino?.pais || "Desconocido",
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  return (
    <>
      <Navbar cart={cart} removeFromCart={removeFromCart} />
      <Banner products={products} />
      <main className="main-content">
        <ProductList products={products} addToCart={addToCart} />
      </main>
      <Footer />
      {/* Banner estático */}
      <Banner />

      {/* Carrusel dinámico usando las imágenes de los productos ya cargados */}
      <Carrusel
        images={products
          .map((p) => p.imagen_principal)
          .filter((img) => img && img !== "https://via.placeholder.com/200")}
      />
    </>
  );
}

export default App;
