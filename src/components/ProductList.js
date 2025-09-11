import React, { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://travel-tool.net/admin/xml/allseasons.xml")
      .then((res) => res.text())
      .then((data) => {
        const parser = new XMLParser();
        const json = parser.parse(data);
        const items = json.root?.item || [];
        setProducts(items);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Paquetes Disponibles</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        <div className="product-list">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
