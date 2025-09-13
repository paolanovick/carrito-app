import React, { useState } from "react";

const Modal = ({ product, onClose }) => {
  // Hooks siempre al inicio
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si no hay producto, no mostramos nada
  if (!product || !product.id) return null;

  const images = [
    product.imagen_principal,
    ...(product.galeria_imagenes || []),
  ];

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        <h2>{product.titulo.replace(/<br>/g, " ")}</h2>
        <p>
          {product.destinoCiudad}, {product.destinoPais} - {product.cant_noches}{" "}
          noches
        </p>
        <p>Precio doble: ${product.doble_precio}</p>
        <p>Hotel: {product.hoteles?.[0]?.nombre || "No disponible"}</p>
        <p>
          Vigencia: {product.fecha_vigencia_desde || "N/A"} →{" "}
          {product.fecha_vigencia_hasta || "N/A"}
        </p>

        <div className="modal-gallery">
          <button onClick={prevImage}>{"<"}</button>
          <img
            src={images[currentIndex]}
            alt={`${product.titulo} ${currentIndex + 1}`}
          />
          <button onClick={nextImage}>{">"}</button>
        </div>

        <div
          className="modal-description"
          dangerouslySetInnerHTML={{ __html: product.incluye || "" }}
        />
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          max-width: 800px;
          width: 90%;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
        }
        .modal-gallery {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 15px 0;
        }
        .modal-gallery img {
          max-width: 600px;
          max-height: 400px;
          margin: 0 10px;
          object-fit: cover;
          border-radius: 8px;
        }
        .modal-gallery button {
          background: #ddd;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 5px;
        }
        .modal-description {
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default Modal;
