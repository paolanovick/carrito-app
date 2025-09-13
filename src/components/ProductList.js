import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://3a08fb666a60.ngrok-free.app/webhook/api",
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const paquetes = data?.paquetes;

        if (!paquetes || !Array.isArray(paquetes)) {
          throw new Error("No se encontraron paquetes válidos en la respuesta");
        }

        const formatted = paquetes.map((p, index) => ({
          id: p.paquete_externo_id || `package-${index}`,
          titulo: p.titulo
            ? p.titulo
                .replace(/<br>/g, " ")
                .replace(/<[^>]*>/g, "")
                .trim()
            : "Sin título",
          url: p.url?.trim() || "#",
          imagen_principal:
            p.imagen_principal || "https://via.placeholder.com/200",
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

        setProducts(formatted);
        setError(null);
      } catch (err) {
        setError(`Error al cargar productos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="product-list-title">
        Productos Disponibles ({products.length})
      </h2>
      <div className="product-list">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
