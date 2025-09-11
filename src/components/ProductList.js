import React, { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchXML = async () => {
      try {
        const response = await fetch(
          "https://travel-tool.net/admin/xml/allseasons.xml"
        );
        if (!response.ok) throw new Error("No se pudo cargar el XML");

        const xmlString = await response.text();
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const jsonData = parser.parse(xmlString);

        let paquetes = jsonData?.root?.paquetes?.paquete;

        if (!paquetes) {
          setError("No se encontraron paquetes");
          setLoading(false);
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
          url: p.url?.["#text"] || p.url, // manejo CDATA
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error(err);
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchXML();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="product-list"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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
