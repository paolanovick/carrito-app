import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div
      className="product-card"
      style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px" }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p style={{ fontWeight: "bold" }}>
        Precio: ${product.price.toLocaleString()}
      </p>
      <button
        onClick={() => addToCart(product)}
        style={{ marginTop: "10px", padding: "10px 15px", cursor: "pointer" }}
      >
        Agregar al carrito
      </button>
      <a
        href={product.url}
        target="_blank"
        rel="noreferrer"
        style={{ display: "block", marginTop: "5px", color: "#1976d2" }}
      >
        Ver detalle
      </a>
    </div>
  );
};

export default ProductCard;
