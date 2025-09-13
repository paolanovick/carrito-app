import React, { useState, useEffect } from "react";

const CarouselList = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateTitle, setAnimateTitle] = useState(true);

  // Auto-play del carrusel
  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        // Antes de cambiar el slide, animamos el título hacia la izquierda
        setAnimateTitle(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
          setAnimateTitle(true); // vuelve a entrar desde la derecha
        }, 500); // tiempo igual a la duración de la animación de salida
      }, 5000); // Cambia cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [images]);

  useEffect(() => {
    setCurrentIndex(0);
    setAnimateTitle(true);
  }, [images]);

  if (!images) return null;

  if (images.length === 0) {
    return (
      <div className="no-images">
        <p>No hay imágenes disponibles en el carrusel</p>
      </div>
    );
  }

  const nextSlide = () => {
    setAnimateTitle(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setAnimateTitle(true);
    }, 500);
  };

  const prevSlide = () => {
    setAnimateTitle(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setAnimateTitle(true);
    }, 500);
  };

  const goToSlide = (index) => {
    setAnimateTitle(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setAnimateTitle(true);
    }, 500);
  };

  return (
    <div className="carousel-container">
      <h2 className={`carousel-title ${animateTitle ? "slide-in" : "slide-out"}`}>
        IMPERDIBLES DE ESTA TEMPORADA
      </h2>

      <div className="carousel-wrapper">
        <div className="carousel-main">
          <div className="carousel-slide-container">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
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
                      <h3 className="carousel-image-title">{image.titulo}</h3>
                    )}
                    {image.descripcion && (
                      <p className="carousel-image-description">{image.descripcion}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button onClick={prevSlide} className="carousel-nav carousel-nav-prev" aria-label="Imagen anterior">&#8249;</button>
              <button onClick={nextSlide} className="carousel-nav carousel-nav-next" aria-label="Imagen siguiente">&#8250;</button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="carousel-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      <style jsx>{`
        .carousel-title {
          font-size: 2.3rem;
          font-weight: 700;
          color: #514628ff;
          text-align: center;
          margin-bottom: 25px;
          text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
        }

        /* Animaciones de entrada y salida */
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutLeft {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-100%);
          }
        }

        .slide-in {
          animation: slideInRight 0.5s ease forwards;
        }

        .slide-out {
          animation: slideOutLeft 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default CarouselList;
