import React, { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/allseasons.xml")
      .then((res) => res.text())
      .then((xmlString) => {
        const cleanXmlString = xmlString.replace(/^\uFEFF/, "");
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const jsonData = parser.parse(cleanXmlString);

        console.log(JSON.stringify(jsonData, null, 2)); // para ver la estructura exacta

        let paquetes =
          jsonData.root?.paquetes?.paquete || jsonData.paquetes?.paquete;
        if (!paquetes) {
          console.error("XML no tiene paquetes");
          return;
        }

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
