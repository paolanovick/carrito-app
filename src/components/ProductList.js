import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://e8f03bb551f6.ngrok-free.app/webhook/api",
        {
          headers: {
            "ngrok-skip-browser-warning": "1",
          },
        }
      );
      const data = await response.json();
      console.log(data);

      // Verificamos si data.root.paquetes.paquete es un array o un objeto único
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
      console.error(err);
      setError("No se pudieron cargar los productos");
    }
  };

  fetchProducts();
}, []);


  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>No hay productos disponibles</p>;

  return (
    <div className="product-list">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductList;
