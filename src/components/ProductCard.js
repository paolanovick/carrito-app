import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <img
        src={product.imagen}
        alt={product.titulo}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <h3>{product.titulo}</h3>
      <p>
        {product.ciudad}, {product.pais}
      </p>
      <p>Noches: {product.noches}</p>
      <p>
        Precio doble:{" "}
        {product.precioDoble.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        })}
      </p>
      <button onClick={() => addToCart(product)}>Agregar al carrito</button>
      <a href={product.url} target="_blank" rel="noopener noreferrer">
        Ver detalles
      </a>
    </div>
  );
};

export default ProductCard;
