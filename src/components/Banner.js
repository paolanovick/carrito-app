import React, { useState, useEffect } from "react";

// Lista de imágenes cargadas manualmente
const IMAGES = [
  { src: "/images/Banner 1.png", titulo: "Oferta 1" },
  { src: "/images/Banner 2.png", titulo: "Oferta 2" },
  { src: "/images/Banner 3.jpg", titulo: "Oferta 3" },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % IMAGES.length);

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 overflow-hidden rounded-xl shadow-lg">
      <img
        src={IMAGES[current].src}
        alt={IMAGES[current].titulo}
        className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transition-all duration-700"
      />
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
        <h2 className="text-lg font-bold">{IMAGES[current].titulo}</h2>
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-3 py-2 rounded-full hover:bg-opacity-70"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-3 py-2 rounded-full hover:bg-opacity-70"
      >
        ▶
      </button>
    </div>
  );
};

export default Banner;
