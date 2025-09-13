import React, { useState, useEffect } from "react";

const Carrusel = ({ apiUrl }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${apiUrl}/carrusel`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(
            data.map((imageUrl, index) => ({
              src: imageUrl || "https://via.placeholder.com/400",
              titulo: `Imagen ${index + 1}`,
            }))
          );
        } else if (data?.imagenes && Array.isArray(data.imagenes)) {
          setImages(
            data.imagenes.map((imageUrl, index) => ({
              src: imageUrl || "https://via.placeholder.com/400",
              titulo: `Imagen ${index + 1}`,
            }))
          );
        } else {
          console.log("No se encontraron imágenes");
          setImages([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando carrusel:", err);
        setImages([]);
      });
  }, [apiUrl]);

  // Auto-advance
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="max-w-5xl mx-auto my-6 p-4 text-center">
        <p>Cargando carrusel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-6 relative">
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={img.src}
                alt={img.titulo}
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          →
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carrusel;
