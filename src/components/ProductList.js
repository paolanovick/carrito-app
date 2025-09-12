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
          "https://ff910aaa68e6.ngrok-free.app/webhook/api",
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Status de respuesta:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos completos del API:", data);

        // CORREGIDO: La estructura real es {"paquetes": [...]}
        const paquetes = data?.paquetes;
        console.log("Paquetes extraídos:", paquetes);

        if (!paquetes || !Array.isArray(paquetes)) {
          console.log("Estructura de datos disponible:", Object.keys(data));
          throw new Error("No se encontraron paquetes válidos en la respuesta");
        }

        console.log(`Encontrados ${paquetes.length} paquetes`);

        const formatted = paquetes.map((p, index) => {
          console.log(`Procesando paquete ${index + 1}:`, p);

          return {
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
            // CORREGIDO: Acceso directo a doble_precio y alternativas
            doble_precio: parseFloat(
              p.doble_precio ||
                p.salidas?.salida?.[0]?.doble_precio ||
                p.precio ||
                0
            ),
            // CORREGIDO: Mejor manejo de destinos
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
          };
        });

        console.log("Productos formateados:", formatted);
        console.log(`Total de productos procesados: ${formatted.length}`);

        setProducts(formatted);
        setError(null);
      } catch (err) {
        console.error("Error completo:", err);
        setError(`Error al cargar productos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Productos Disponibles ({products.length})
      </h2>
      <div
        className="product-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
          padding: "16px",
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
