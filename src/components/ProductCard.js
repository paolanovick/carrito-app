import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "5px",
        }}
      />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>Precio: ${product.price.toLocaleString()}</p>
      <button onClick={() => addToCart(product)}>Agregar al carrito</button>
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
