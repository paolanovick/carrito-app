import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      {product.image && (
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
      )}
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      <button onClick={() => addToCart(product)}>Agregar al carrito</button>
    </div>
  );
};

export default ProductCard;
