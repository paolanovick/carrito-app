import React from "react";

const ProductCard = ({ product, addToCart, onSelect }) => {
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

      {/* Abrir modal en vez de link externo */}
      <button onClick={() => onSelect(product)}>Ver paquete</button>

      <button onClick={() => addToCart(product)}>Comprar</button>
    </div>
  );
};


export default ProductCard;
