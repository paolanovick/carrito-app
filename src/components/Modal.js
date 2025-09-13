import React, { useState, useEffect } from "react";

const Modal = ({ product, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preparar imágenes con useMemo
  const images = React.useMemo(() => {
    if (!product?.rawData?.galeria_imagenes) return [];
    return Object.values(product.rawData.galeria_imagenes).map((img) => ({
      url: img,
      src: img,
      imagen: img,
    }));
  }, [product]);

  // Auto-play del carrusel
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [images]);

  // Reset del índice cuando cambien las imágenes
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Early return después de hooks
  if (!product || !product.rawData) return null;

  const raw = product.rawData;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

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
          ×
        </button>

        <div className="modal-header">
          <h2>{raw.titulo.replace(/<br>/g, " ").replace(/<[^>]*>/g, "")}</h2>
          <div className="modal-info">
            <p>
              📍 {product.destinoCiudad}, {product.destinoPais} -{" "}
              {product.cant_noches} noches
            </p>
            <p>💰 Precio doble: ${product.doble_precio}</p>
            <p>🏨 Hotel: {hotelName}</p>
            <p>
              📅 Vigencia: {fechaDesde} → {fechaHasta}
            </p>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="no-images">
            <p>No hay imágenes disponibles en el carrusel</p>
          </div>
        ) : (
          <div className="carousel-wrapper">
            <div className="carousel-main">
              <div className="carousel-slide-container">
                {images.map((image, index) => (
                  <div
                    key={image.id || index}
                    className={`carousel-slide ${
                      index === currentIndex ? "active" : ""
                    }`}
                  >
                    <img
                      src={image.url || image.imagen || image.src}
                      alt={image.titulo || image.alt || `Imagen ${index + 1}`}
                      className="carousel-image"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23f0f0f0"/%3E%3Ctext x="400" y="200" text-anchor="middle" fill="%23666" font-family="Arial" font-size="20"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {(image.titulo || image.descripcion) && (
                      <div className="carousel-overlay">
                        {image.titulo && (
                          <h3 className="carousel-image-title">
                            {image.titulo}
                          </h3>
                        )}
                        {image.descripcion && (
                          <p className="carousel-image-description">
                            {image.descripcion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="carousel-nav carousel-nav-prev"
                    aria-label="Imagen anterior"
                  >
                    &#8249;
                  </button>
                  <button
                    onClick={nextSlide}
                    className="carousel-nav carousel-nav-next"
                    aria-label="Imagen siguiente"
                  >
                    &#8250;
                  </button>
                </>
              )}

              {images.length > 1 && (
                <div className="carousel-counter">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="carousel-indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`carousel-dot ${
                      index === currentIndex ? "active" : ""
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className="modal-description"
          dangerouslySetInnerHTML={{ __html: incluye }}
        />
      </div>

      {/* Estilos */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          overflow-y: auto;
          padding: 20px;
        }

        .modal-content {
          background: #fff;
          border-radius: 15px;
          max-width: 900px;
          width: 90%;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 2rem;
          border: none;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          cursor: pointer;
          z-index: 20;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
        }

        .modal-header {
          padding: 30px 30px 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .modal-header h2 {
          font-size: 1.8rem;
          color: #333;
          margin: 0 0 15px 0;
          font-weight: bold;
        }

        .modal-info {
          display: grid;
          gap: 8px;
        }

        .modal-info p {
          margin: 0;
          font-size: 1rem;
          color: #555;
        }

        .no-images {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 1.1rem;
        }

        .carousel-wrapper {
          margin: 0;
          border-radius: 0;
          overflow: hidden;
          box-shadow: none;
          background: #fff;
        }

        .carousel-main {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .carousel-slide-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }

        .carousel-slide.active {
          opacity: 1;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .carousel-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 30px 20px 20px;
        }

        .carousel-image-title {
          margin: 0 0 10px 0;
          font-size: 1.3rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .carousel-image-description {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
          line-height: 1.4;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          font-size: 2rem;
          padding: 10px 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 5px;
          z-index: 10;
        }

        .carousel-nav:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-nav-prev {
          left: 15px;
        }

        .carousel-nav-next {
          right: 15px;
        }

        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 15px;
          background: #f8f9fa;
        }

        .carousel-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: #ccc;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .carousel-dot:hover {
          background: #999;
          transform: scale(1.2);
        }

        .carousel-dot.active {
          background: #007bff;
          transform: scale(1.3);
        }

        .carousel-counter {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          z-index: 10;
        }

        .modal-description {
          padding: 30px;
          line-height: 1.6;
          color: #444;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            margin: 10px;
          }

          .modal-header {
            padding: 20px;
          }

          .modal-header h2 {
            font-size: 1.4rem;
          }

          .carousel-main {
            height: 250px;
          }

          .carousel-nav {
            font-size: 1.5rem;
            padding: 8px 12px;
          }

          .carousel-image-title {
            font-size: 1.1rem;
          }

          .carousel-image-description {
            font-size: 0.8rem;
          }

          .modal-description {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
