import React, { useState } from "react";
import Modal from "./Modal";

const ProductCard = ({ product, addToCart }) => {
  const [showModal, setShowModal] = useState(false);

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

      {/* Botón que abre el modal */}
      <button onClick={() => setShowModal(true)}>Ver paquete</button>
      <br />
      {/* Botón para añadir al carrito (lo mantenemos) */}
      <button onClick={() => addToCart(product)}>Añadir al carrito</button>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>{product.titulo}</h2>
        <img
          src={product.imagen_principal || "https://via.placeholder.com/400"}
          alt={product.titulo}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <p>
          <strong>Destino:</strong> {product.destinoCiudad},{" "}
          {product.destinoPais}
        </p>
        <p>
          <strong>Noches:</strong> {product.cant_noches}
        </p>
        <p>
          <strong>Precio doble:</strong> ${product.doble_precio}
        </p>

        {/* Nuevo botón Comprar */}
        <button
          style={{
            background: "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            marginTop: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            addToCart(product); // agrega al carrito
            alert("¡Producto agregado! Ahora puedes ir al checkout.");
            setShowModal(false); // cierra modal
          }}
        >
          Comprar
        </button>
      </Modal>
    </div>
  );
};

export default ProductCard;
