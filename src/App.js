import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import Carrusel from "./components/Carrusel";

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null); // Para debug

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("🔄 Conectando a n8n workflow...");

        const apiUrl = "https://2cd882428218.ngrok-free.app/api";
        console.log("📡 URL de n8n:", apiUrl);

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "User-Agent": "n8n-client/1.0",
            Accept: "application/json",
          },
        });

        console.log("📊 Status de n8n:", res.status);

        if (!res.ok) {
          throw new Error(`n8n HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("🤖 Respuesta RAW de n8n:", data);
        console.log("🔍 Tipo de respuesta:", typeof data);
        console.log("🗂️ Es array?", Array.isArray(data));

        if (typeof data === "object" && data !== null) {
          console.log("🗃️ Keys del objeto principal:", Object.keys(data));

          // Si hay sub-objetos, mostrar sus keys también
          Object.keys(data).forEach((key) => {
            if (typeof data[key] === "object" && data[key] !== null) {
              console.log(`📁 Keys de ${key}:`, Object.keys(data[key]));
            }
          });
        }

        setRawData(data); // Guardar para mostrar en UI si es necesario

        // Estrategia de parsing para diferentes formatos de n8n
        let paquetes = [];

        // Formato 1: Array directo desde n8n
        if (Array.isArray(data)) {
          paquetes = data;
          console.log("✅ n8n formato: Array directo");
        }
        // Formato 2: Objeto con items (común en n8n)
        else if (data?.items && Array.isArray(data.items)) {
          paquetes = data.items;
          console.log("✅ n8n formato: data.items");
        }
        // Formato 3: Objeto con data
        else if (data?.data && Array.isArray(data.data)) {
          paquetes = data.data;
          console.log("✅ n8n formato: data.data");
        }
        // Formato 4: Respuesta de HTTP Request en n8n
        else if (data?.body) {
          const body =
            typeof data.body === "string" ? JSON.parse(data.body) : data.body;
          if (Array.isArray(body)) {
            paquetes = body;
            console.log("✅ n8n formato: data.body (array)");
          } else if (body?.paquetes) {
            paquetes = Array.isArray(body.paquetes)
              ? body.paquetes
              : [body.paquetes];
            console.log("✅ n8n formato: data.body.paquetes");
          }
        }
        // Formato 5: Estructura XML convertida
        else if (data?.root?.paquetes?.paquete) {
          paquetes = Array.isArray(data.root.paquetes.paquete)
            ? data.root.paquetes.paquete
            : [data.root.paquetes.paquete];
          console.log("✅ n8n formato: XML convertido");
        }
        // Formato 6: Directo paquetes
        else if (data?.paquetes) {
          paquetes = Array.isArray(data.paquetes)
            ? data.paquetes
            : [data.paquetes];
          console.log("✅ n8n formato: data.paquetes");
        }
        // Formato 7: Si n8n devuelve un solo objeto como item
        else if (data?.titulo || data?.name) {
          paquetes = [data];
          console.log("✅ n8n formato: Objeto único");
        } else {
          console.log("❌ Estructura no reconocida de n8n");
          console.log("🔍 Estructura completa:", JSON.stringify(data, null, 2));
          throw new Error(
            `Formato de n8n no reconocido. Keys disponibles: ${Object.keys(
              data
            ).join(", ")}`
          );
        }

        console.log(`📦 Paquetes encontrados en n8n: ${paquetes.length}`);

        if (paquetes.length > 0) {
          console.log("🔍 Ejemplo del primer paquete de n8n:", paquetes[0]);
        }

        // Procesar los paquetes
        const processedProducts = paquetes
          .filter((p, index) => {
            // Verificar que el paquete tenga datos mínimos
            const hasTitle = p?.titulo || p?.name || p?.title;
            const isObject = p && typeof p === "object";

            if (!isObject) {
              console.log(`⚠️ Paquete ${index} no es objeto:`, typeof p);
              return false;
            }

            if (!hasTitle) {
              console.log(`⚠️ Paquete ${index} sin título:`, Object.keys(p));
              return false;
            }

            return true;
          })
          .map((p, index) => {
            // Crear producto normalizado
            const product = {
              id: p.paquete_externo_id || p.id || p.ID || `package-${index}`,
              titulo:
                (p.titulo || p.name || p.title || p.TITULO || "Sin título")
                  ?.toString()
                  ?.replace(/<br\s*\/?>/gi, " ")
                  ?.replace(/<[^>]*>/g, "")
                  ?.trim() || "Sin título",
              imagen_principal:
                p.imagen_principal ||
                p.image ||
                p.foto ||
                p.IMAGE ||
                "https://via.placeholder.com/300x200?text=Sin+Imagen",
              url: (p.url || p.link || p.URL || "#").toString().trim(),
              cant_noches: parseInt(
                p.cant_noches || p.noches || p.nights || p.NOCHES || 0
              ),
              doble_precio: parseFloat(
                p.doble_precio ||
                  p.precio ||
                  p.price ||
                  p.PRECIO ||
                  p.salidas?.salida?.[0]?.doble_precio ||
                  0
              ),
              destinoCiudad:
                p.destinos?.destino?.ciudad ||
                (Array.isArray(p.destinos?.destino)
                  ? p.destinos.destino[0]?.ciudad
                  : null) ||
                p.ciudad ||
                p.city ||
                p.CIUDAD ||
                "Desconocido",
              destinoPais:
                p.destinos?.destino?.pais ||
                (Array.isArray(p.destinos?.destino)
                  ? p.destinos.destino[0]?.pais
                  : null) ||
                p.pais ||
                p.country ||
                p.PAIS ||
                "Desconocido",
            };

            console.log(`✨ Producto ${index + 1} de n8n procesado:`, {
              id: product.id,
              titulo: product.titulo.substring(0, 50) + "...",
              precio: product.doble_precio,
              ciudad: product.destinoCiudad,
            });

            return product;
          });

        console.log(
          `🎉 Total productos procesados desde n8n: ${processedProducts.length}`
        );

        if (processedProducts.length === 0) {
          console.log("⚠️ No se procesaron productos desde n8n");
          console.log("🔍 Datos raw para análisis:", data);
        }

        setProducts(processedProducts);
        setError(null);
      } catch (err) {
        console.error("❌ Error conectando con n8n:", err);

        let errorMessage = "Error desconocido con n8n";

        if (err.message.includes("fetch")) {
          errorMessage =
            "No se puede conectar con n8n. ¿Está el workflow activo?";
        } else if (err.message.includes("HTTP error")) {
          errorMessage = `Error en workflow de n8n: ${err.message}`;
        } else {
          errorMessage = `Error procesando datos de n8n: ${err.message}`;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    console.log("🛒 Agregando al carrito:", product.titulo);
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id) => {
    console.log("🗑️ Eliminando del carrito:", id);
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">🤖 Conectando con n8n workflow...</p>
          <p className="text-sm text-gray-600">
            Cargando productos desde la automatización...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold text-red-800 mb-2">
              ❌ Error con n8n
            </h2>
            <p className="text-red-700 mb-4">{error}</p>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Checklist n8n:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• ¿Está el workflow activo? ⚡</li>
                <li>• ¿El webhook está en GET /api? 🔗</li>
                <li>• ¿ngrok está ejecutándose? 🌐</li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                🔄 Reintentar conexión
              </button>

              {rawData && (
                <button
                  onClick={() => {
                    console.log("🔍 Datos RAW de n8n:", rawData);
                    alert("Datos mostrados en consola - F12 para ver");
                  }}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                >
                  🤖 Ver datos de n8n
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar cart={cart} removeFromCart={removeFromCart} />
      <Banner products={products} />

      {products.length > 0 && (
        <Carrusel
          images={products
            .map((p) => p.imagen_principal)
            .filter((img) => img && !img.includes("placeholder"))}
        />
      )}

      <main className="main-content">
        <ProductList products={products} addToCart={addToCart} />

        {products.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-xl mb-2">
                🤖 n8n conectado pero sin productos
              </p>
              <p className="text-sm text-gray-600 mb-4">
                El workflow está respondiendo pero no devuelve productos
                válidos.
              </p>

              {rawData && (
                <button
                  onClick={() => {
                    console.log("📊 Estado actual:");
                    console.log("- Raw data de n8n:", rawData);
                    console.log("- Productos procesados:", products);
                    alert("Ver consola (F12) para análisis completo");
                  }}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  🔍 Analizar respuesta n8n
                </button>
              )}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-green-600">
              ✅ {products.length} productos cargados desde n8n workflow
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;
