import React, { useState } from "react";

const Modal = ({ product, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product || !product.rawData) return null;

  const raw = product.rawData;

  // Galería de imágenes
  const images = raw.galeria_imagenes
    ? Object.values(raw.galeria_imagenes)
    : [];

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const hotelName =
    raw.hoteles && raw.hoteles.length > 0
      ? raw.hoteles[0].nombre
      : "No disponible";

  const incluye = raw.incluye || "";
  const fechaDesde = raw.fecha_vigencia_desde || "N/A";
  const fechaHasta = raw.fecha_vigencia_hasta || "N/A";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        <h2>{raw.titulo.replace(/<br>/g, " ").replace(/<[^>]*>/g, "")}</h2>
        <p>
          {product.destinoCiudad}, {product.destinoPais} - {product.cant_noches}{" "}
          noches
        </p>
        <p>Precio doble: ${product.doble_precio}</p>
        <p>Hotel: {hotelName}</p>
        <p>
          Vigencia: {fechaDesde} → {fechaHasta}
        </p>

        {images.length > 0 && (
          <div className="carousel">
            <button className="carousel-btn prev" onClick={prevImage}>
              ‹
            </button>
            <img
              src={images[currentIndex]}
              alt={`Imagen ${currentIndex + 1}`}
            />
            <button className="carousel-btn next" onClick={nextImage}>
              ›
            </button>
          </div>
        )}

        <div
          className="modal-description"
          dangerouslySetInnerHTML={{ __html: incluye }}
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
          overflow-y: auto;
        }

        .modal-content {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          max-width: 800px;
          width: 90%;
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

        .carousel {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
          position: relative;
        }

        .carousel img {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
        }

        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.4);
          border: none;
          color: #fff;
          font-size: 2rem;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 50%;
        }

        .carousel-btn.prev {
          left: 10px;
        }
        .carousel-btn.next {
          right: 10px;
        }

        .modal-description {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Modal;
