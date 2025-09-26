// 📁 api/n8n.js - Versión con debug

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const n8nUrl = "http://167.172.31.249:5678/webhook/api";
    console.log("🚀 Intentando conectar a:", n8nUrl);

    const response = await fetch(n8nUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Vercel-Proxy",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
      timeout: 10000, // 10 segundos timeout
    });

    console.log("📡 Status de respuesta:", response.status);
    console.log("📋 Content-Type:", response.headers.get("content-type"));

    if (!response.ok) {
      throw new Error(`N8N respondió con status ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    // Verificar si realmente es JSON
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.log("⚠️ Respuesta no es JSON:", text.substring(0, 200));

      return res.status(500).json({
        error: "N8N no devolvió JSON",
        contentType,
        preview: text.substring(0, 100),
        status: response.status,
      });
    }

    const data = await response.json();
    console.log("✅ Datos recibidos correctamente");
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error en proxy:", error.message);

    res.status(500).json({
      error: "Error conectando a N8N",
      message: error.message,
      url: "http://167.172.31.249:5678/webhook/api",
      timestamp: new Date().toISOString(),
    });
  }
}
