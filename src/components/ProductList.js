import React, { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/allseasons.xml") // o la URL externa si funciona con CORS
      .then((res) => res.text())
      .then((xmlString) => {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const jsonData = parser.parse(xmlString);

        console.log("JSON Parseado:", jsonData); // <--- Para ver la estructura exacta

        // Verificar paquetes dentro de root o directamente
        let paquetes;
        if (jsonData.root?.paquetes?.paquete) {
          paquetes = jsonData.root.paquetes.paquete;
        } else if (jsonData.paquetes?.paquete) {
          paquetes = jsonData.paquetes.paquete;
        } else {
          console.error("XML no tiene paquetes");
          return;
        }

        // Asegurarse de que siempre sea un array
        if (!Array.isArray(paquetes)) paquetes = [paquetes];

        const formattedProducts = paquetes.map((p) => ({
          id: p.paquete_externo_id,
          title: p.titulo?.replace(/<[^>]+>/g, ""),
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
    <div
      className="product-list"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
        gap: "20px",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductList;
