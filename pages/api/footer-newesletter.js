// api/footer-newsletter.js - Proxy para Footer Newsletter
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const n8nUrl = "http://167.172.31.249:5678/webhook/footer-newsletter";

    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();

    res
      .status(200)
      .json({ message: "Suscripción enviada correctamente", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al enviar la suscripción",
      error: error.message,
    });
  }
}
