import React, { useState } from "react";

const Modal = ({ product, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product) return null;

  // Construir array de imágenes: principal + galería filtrando vacíos
  const gallery = [
    product.imagen_principal,
    ...(product.galeria_imagenes
      ? Object.values(product.galeria_imagenes).filter(Boolean)
      : []),
  ];

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        {/* Carrusel */}
        <div className="modal-carousel">
          <button onClick={prevSlide} className="carousel-nav">
            &#8249;
          </button>
          <img
            src={gallery[currentIndex]}
            alt={`${product.titulo} ${currentIndex + 1}`}
            className="carousel-image"
          />
          <button onClick={nextSlide} className="carousel-nav">
            &#8250;
          </button>
        </div>

        {/* Información del paquete */}
        <h2>{product.titulo}</h2>
        <p>
          {product.destinoCiudad}, {product.destinoPais} - {product.cant_noches}{" "}
          noches
        </p>
        <p>Precio doble: ${product.doble_precio}</p>
        <p>Hotel: {product.hoteles?.hotel?.nombre || "No disponible"}</p>
        <p>
          Vigencia: {product.fecha_vigencia_desde} a{" "}
          {product.fecha_vigencia_hasta}
        </p>

        {/* Incluye */}
        {product.incluye && (
          <div
            className="modal-includes"
            dangerouslySetInnerHTML={{ __html: product.incluye }}
          />
        )}
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
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
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

        .modal-carousel {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
        }

        .carousel-image {
          max-width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 5px;
        }

        .carousel-nav {
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          border: none;
          font-size: 2rem;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 5px;
          margin: 0 10px;
        }

        .modal-includes {
          margin-top: 15px;
          font-size: 0.95rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default Modal;
