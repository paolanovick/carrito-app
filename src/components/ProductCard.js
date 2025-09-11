import React from "react";

const ProductCard = ({ product, addToCart }) => (
  <div className="product-card">
    <img src={product.image} alt={product.title} />
    <h3>{product.title}</h3>
    <p>{product.description}</p>
    <span>
      {product.price.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      })}
    </span>
    <button onClick={() => addToCart(product)}>Agregar</button>
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        marginTop: "5px",
        fontSize: "0.85rem",
        color: "#007bff",
      }}
    >
      Ver detalles
    </a>
  </div>
);

export default ProductCard;
