import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        width: "200px",
        textAlign: "center",
      }}
    >
      <div className="product-card">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <p>Precio: ${product.price}</p>
        <button onClick={() => addToCart(product)}>Agregar al carrito</button>
      </div>
    </div>
  );
};

export default ProductCard;
