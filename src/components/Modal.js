import React, { useState } from "react";

const Modal = ({ product, onClose }) => {
  if (!product) return null;

  // Convertir la galería de la API en un array
  const gallery = product.galeria_imagenes
    ? Object.values(product.galeria_imagenes)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>{product.titulo}</h2>
        <p>
          {product.destinoCiudad}, {product.destinoPais} - {product.cant_noches}{" "}
          noches
        </p>
        <p>Precio doble: ${product.doble_precio}</p>

        <p>
          <strong>Hoteles:</strong>{" "}
          {product.hoteles?.map((h) => h.nombre).join(", ") ||
            "No especificado"}
        </p>

        <p>
          <strong>Vigencia:</strong> {product.fecha_vigencia_desde} a{" "}
          {product.fecha_vigencia_hasta}
        </p>

        {/* Carrusel de galería de imágenes */}
        {gallery.length > 0 && (
          <div className="modal-carousel">
            <button className="carousel-btn prev" onClick={prevImage}>
              &#8249;
            </button>
            <img
              src={gallery[currentIndex]}
              alt={`${product.titulo} ${currentIndex + 1}`}
            />
            <button className="carousel-btn next" onClick={nextImage}>
              &#8250;
            </button>
          </div>
        )}

        {/* Info extendida de la API */}
        {product.incluye && (
          <div
            className="modal-description"
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
          max-width: 900px;
          width: 90%;
          max-height: 90%;
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
          position: relative;
          margin: 15px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-carousel img {
          max-width: 100%;
          max-height: 400px;
          border-radius: 5px;
          object-fit: cover;
        }

        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          font-size: 2rem;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 5px;
          z-index: 10;
        }

        .carousel-btn.prev {
          left: 10px;
        }

        .carousel-btn.next {
          right: 10px;
        }

        .modal-description {
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default Modal;
