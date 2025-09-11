import React, { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Reemplazar fetch con '/allseasons.xml' si lo guardaste en public/
    fetch("https://travel-tool.net/admin/xml/allseasons.xml")
      .then((res) => res.text())
      .then((data) => {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const json = parser.parse(data);

        // json.root.paquetes.paquete puede ser un objeto o array
        let paquetes = json.root.paquetes.paquete;
        if (!Array.isArray(paquetes)) paquetes = [paquetes];

        const formattedProducts = paquetes.map((p) => ({
          id: p.paquete_externo_id,
          title: p.titulo?.replace(/<[^>]+>/g, ""), // eliminar HTML
          description: p.incluye?.replace(/<[^>]+>/g, ""),
          price: parseFloat(p.doble_precio) || 0,
          image:
            p.imagen_principal ||
            "https://via.placeholder.com/220x150?text=Sin+Imagen",
          url: p.url,
        }));

        setProducts(formattedProducts);
      })
      .catch((err) => console.error("Error al cargar XML:", err));
  }, []);

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductList;
