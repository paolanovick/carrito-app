import React, { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://travel-tool.net/admin/xml/allseasons.xml")
      .then((res) => res.text())
      .then((xmlString) => {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const jsonData = parser.parse(xmlString);

        let paquetes =
          jsonData.root?.paquetes?.paquete || jsonData.paquetes?.paquete;
        if (!paquetes) {
          console.error("XML no tiene paquetes o no es accesible");
          return;
        }

        if (!Array.isArray(paquetes)) paquetes = [paquetes];

        const formattedProducts = paquetes.map((p) => ({
          id: p.paquete_externo_id,
          title: p.titulo?.replace(/<[^>]+>/g, "") || "Sin título",
          description: p.incluye?.replace(/<[^>]+>/g, "") || "Sin descripción",
          price: parseFloat(p.doble_precio) || 0,
          image:
            p.imagen_principal ||
            "https://via.placeholder.com/220x150?text=Sin+Imagen",
          url: p.url?.["#cdata-section"] || "#",
        }));

        setProducts(formattedProducts);
      })
      .catch((err) => console.error("Error al convertir XML a JSON:", err));
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
