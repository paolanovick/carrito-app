import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, addToCart, onSelect }) => {
  if (!products) return null;

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
        NUESTROS RECOMENDADOS 
      </h2>
      <div className="product-list">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            addToCart={addToCart}
            onSelect={onSelect} // 👈 pasamos la función para abrir el modal
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
