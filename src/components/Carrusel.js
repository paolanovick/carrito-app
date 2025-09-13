import React, { useEffect, useState } from "react";

const Carrusel = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCarrusel = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://3a08fb666a60.ngrok-free.app/webhook/api/carrusel", // URL específica para carrusel
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Adaptar según lo que devuelva tu endpoint de carrusel
        let imageUrls = [];

        if (Array.isArray(data)) {
          // Si devuelve array directo: ["img1.jpg", "img2.jpg"]
          imageUrls = data.filter((url) => url && url.trim());
        } else if (data?.imagenes && Array.isArray(data.imagenes)) {
          // Si devuelve objeto: {imagenes: ["img1.jpg", "img2.jpg"]}
          imageUrls = data.imagenes.filter((url) => url && url.trim());
        } else if (data?.carrusel && Array.isArray(data.carrusel)) {
          // Si devuelve: {carrusel: [items con imagen]}
          imageUrls = data.carrusel
            .map((item) => item.imagen || item.image || item.foto)
            .filter((url) => url && url.trim());
        }

        if (!imageUrls || imageUrls.length === 0) {
          throw new Error("No se encontraron imágenes válidas en la respuesta");
        }

        setImages(imageUrls);
        setError(null);
      } catch (err) {
        setError(`Error al cargar carrusel: ${err.message}`);
        console.error("Error fetching carrusel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrusel();
  }, []);

  // Auto-advance
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  if (loading) {
    return (
      <div className="loading">
        <div className="w-full max-w-4xl mx-auto my-8 px-4">
          <div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
          <p className="mt-4 text-center text-gray-500">Cargando carrusel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="w-full max-w-4xl mx-auto my-8 p-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="no-images">
        <div className="w-full max-w-4xl mx-auto my-8 p-4 text-center">
          <p className="text-gray-500">
            No hay imágenes disponibles para el carrusel
          </p>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Carrusel de Imágenes ({images.length})
      </h2>

      <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-900">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            height: "300px",
          }}
        >
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 relative"
              style={{ height: "300px" }}
            >
              <img
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x300/e2e8f0/64748b?text=Imagen+no+disponible";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 z-10"
              aria-label="Imagen anterior"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 z-10"
              aria-label="Siguiente imagen"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Carrusel;
