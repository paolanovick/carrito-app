import React from "react";

const Modal = ({ product, onClose }) => {
  if (!product) return null;

  const gallery = product.galeria_imagenes
    ? Object.values(product.galeria_imagenes)
    : [];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>{product.titulo}</h2>
        <p>
          {product.destinoCiudad}, {product.destinoPais} - {product.cant_noches}{" "}
          noches
        </p>
        <p>Precio doble: ${product.doble_precio}</p>

        <div className="modal-gallery">
          <img src={product.imagen_principal} alt={product.titulo} />
          {gallery.map((img, index) => (
            <img key={index} src={img} alt={`${product.titulo} ${index + 1}`} />
          ))}
        </div>

        {/* Info extendida de la API */}
        <div
          className="modal-description"
          dangerouslySetInnerHTML={{ __html: product.incluye || "" }}
        />
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          max-width: 800px; /* más grande */
          width: 90%;
          position: relative;
          max-height: 90%;
          overflow-y: auto;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
        }

        .modal-gallery {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 15px 0;
        }

        .modal-gallery img {
          width: calc(50% - 10px);
          border-radius: 5px;
          object-fit: cover;
        }

        .modal-description {
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default Modal;
