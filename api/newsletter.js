export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El email es requerido" });
  }

  try {
    // URL de tu webhook de n8n
   const WEBHOOK_URL = "https://ni-n8n.com/webhook/footer-newsletter";


    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ message: text });
    }

    const data = await response.json().catch(() => null);
    res
      .status(200)
      .json(data || { message: "Suscripción enviada correctamente" });
  } catch (error) {
    console.error("Error newsletter:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
