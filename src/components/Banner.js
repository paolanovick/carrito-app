import React, { useState, useEffect } from "react";

const Banner = ({ products }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000); // cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) return null;

  const currentSlide = products[current];

  return (
    <div className="banner">
      <img src={currentSlide.imagen_principal} alt={currentSlide.titulo} />
      <div className="caption">{currentSlide.titulo}</div>
    </div>
  );
};

export default Banner;
