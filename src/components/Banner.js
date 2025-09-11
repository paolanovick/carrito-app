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
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "300px",
        overflow: "hidden",
        marginBottom: "30px",
      }}
    >
      <img
        src={currentSlide.image}
        alt={currentSlide.title}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
          borderRadius: "5px",
          transition: "opacity 0.8s",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          background: "rgba(0,0,0,0.5)",
          padding: "10px 20px",
          borderRadius: "5px",
        }}
      >
        {currentSlide.title}
      </div>
    </div>
  );
};

export default Banner;
