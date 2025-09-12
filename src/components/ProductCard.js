import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <img
        src={product.imagen_principal || "https://via.placeholder.com/200"}
        alt={product.titulo}
            />
      <h3>{product.titulo}</h3>
      <p>
        {product.destinoCiudad}, {product.destinoPais} - {product.cant_noches}{" "}
        noches
      </p>
      <p>Precio doble: ${product.doble_precio}</p>
      <a href={product.url} target="_blank" rel="noopener noreferrer">
        Ver paquete
      </a>
      <br />
      <button onClick={() => addToCart(product)}>Añadir al carrito</button>
    </div>
  );
};

export default ProductCard;
