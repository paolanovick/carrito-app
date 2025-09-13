import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Carrusel = ({ apiUrl }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Usar el nuevo endpoint específico para carrusel
    fetch(`${apiUrl}/carrusel`)
      .then((res) => res.json())
      .then((data) => {
        // Si configuraste el Response Body como array simple:
        // ["imagen1.jpg", "imagen2.jpg", "imagen3.jpg"]
        if (Array.isArray(data)) {
          setImages(
            data.map((imageUrl, index) => ({
              src: imageUrl || "https://via.placeholder.com/400",
              titulo: `Imagen ${index + 1}`,
            }))
          );
        }
        // Si configuraste el Response Body con estructura:
        // {"imagenes": ["imagen1.jpg", "imagen2.jpg"]}
        else if (data?.imagenes && Array.isArray(data.imagenes)) {
          setImages(
            data.imagenes.map((imageUrl, index) => ({
              src: imageUrl || "https://via.placeholder.com/400",
              titulo: `Imagen ${index + 1}`,
            }))
          );
        }
        // Fallback por si no hay datos
        else {
          console.log("No se encontraron imágenes en la respuesta");
          setImages([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando carrusel:", err);
        setImages([]);
      });
  }, [apiUrl]);

  if (images.length === 0) {
    return (
      <div className="max-w-5xl mx-auto my-6 p-4 text-center">
        <p>Cargando carrusel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-6">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000 }}
        loop={true}
        className="rounded-xl shadow-lg"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img.src}
              alt={img.titulo}
              className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carrusel;
