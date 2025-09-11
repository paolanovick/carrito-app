import React, { useState, useEffect } from "react";

const Banner = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // cambia cada 4 segundos
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

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
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide.image}
          alt={slide.title}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            transition: "opacity 0.8s ease-in-out",
            opacity: index === current ? 1 : 0,
          }}
        />
      ))}
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
        {slides[current].title}
      </div>
    </div>
  );
};

export default Banner;
