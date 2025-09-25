import React, { useState } from "react";

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "success" o "error"

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // URL de tu webhook en n8n
      const n8nUrl = "http://167.172.31.249:5678/webhook/footer-newsletter";

      const response = await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      await response.text(); // no necesitamos usar "data", solo consumir la respuesta

      setMensaje("Suscripción enviada correctamente ✅");
      setTipoMensaje("success");
      setEmail("");
    } catch (error) {
      console.error("Error en la suscripción:", error);
      setMensaje("Error al enviar la suscripción ❌");
      setTipoMensaje("error");
    }
  };

  return (
    <footer className="footer-newsletter">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Suscribirme</button>
      </form>

      {mensaje && (
        <p
          className={`mensaje ${
            tipoMensaje === "success"
              ? "success"
              : tipoMensaje === "error"
              ? "error"
              : ""
          }`}
        >
          {mensaje}
        </p>
      )}
    </footer>
  );
}

export default FooterNewsletter;
