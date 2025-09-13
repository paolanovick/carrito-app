import React, { useState, useEffect } from "react";

const CarouselList = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play del carrusel
  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000); // Cambia cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [images]);

  // Reset del índice cuando cambien las imágenes
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images) return null;

  if (images.length === 0) {
    return (
      <div className="no-images">
        <p>No hay imágenes disponibles en el carrusel</p>
      </div>
    );
  }

  // Funciones de navegación
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">IMPERDIBLES DE ESTA TEMPORADA</h2>

      <div className="carousel-wrapper">
        {/* Imagen Principal */}
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

                {/* Overlay con información */}
                {(image.titulo || image.descripcion) && (
                  <div className="carousel-overlay">
                    {image.titulo && (
                      <h3 className="carousel-image-title">{image.titulo}</h3>
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

          {/* Controles de navegación */}
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
        </div>

        {/* Indicadores (dots) */}
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

        {/* Contador */}
        {images.length > 1 && (
          <div className="carousel-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      <style jsx>{`
        .carousel-container {
          margin: 30px 0;
        }

        .carousel-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fdf6e3;
          text-align: center;
          margin-bottom: 25px;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
        }

        .no-images {
          text-align: center;
          padding: 50px;
          color: #aaa;
          font-size: 1.1rem;
        }

        .carousel-wrapper {
          max-width: 850px;
          margin: 0 auto;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          background: linear-gradient(135deg, #1b1b1b, #2c2c2c);
        }

        .carousel-main {
          position: relative;
          height: 450px;
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
          transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
          transform: scale(0.95);
        }

        .carousel-slide.active {
          opacity: 1;
          transform: scale(1);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.15);
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 16px;
          transition: transform 0.6s ease;
        }

        .carousel-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
          color: #fff;
          padding: 30px 20px 20px;
        }

        .carousel-image-title {
          margin: 0 0 10px 0;
          font-size: 1.4rem;
          font-weight: 700;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
        }

        .carousel-image-description {
          margin: 0;
          font-size: 0.95rem;
          opacity: 0.95;
          line-height: 1.4;
          color: #f0f0f0;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(
            135deg,
            rgba(128, 128, 128, 0.6),
            rgba(64, 64, 64, 0.8)
          );
          color: #fff;
          border: none;
          font-size: 2rem;
          padding: 10px 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 50%;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .carousel-nav:hover {
          background: linear-gradient(
            135deg,
            rgba(192, 192, 192, 0.8),
            rgba(128, 128, 128, 1)
          );
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-nav-prev {
          left: 20px;
        }

        .carousel-nav-next {
          right: 20px;
        }

        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          margin-top: 10px;
        }

        .carousel-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid #fff;
          background: #888;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .carousel-dot:hover {
          background: #ccc;
          transform: scale(1.3);
        }

        .carousel-dot.active {
          background: #f5e26c;
          transform: scale(1.5);
        }

        .carousel-counter {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          z-index: 10;
        }

        @media (max-width: 768px) {
          .carousel-main {
            height: 250px;
          }

          .carousel-nav {
            font-size: 1.5rem;
            padding: 8px 12px;
          }

          .carousel-image-title {
            font-size: 1.2rem;
          }

          .carousel-image-description {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CarouselList;
