import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CarouselList from "./components/CarouselList";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import SearchBar from "./components/SearchBar";
import Formulario from "./components/Formulario";
// import InicioComponent from "./components/InicioComponent"; // Descomentarás cuando lo tengas

function App() {
  // Estados existentes
  const [cart, setCart] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [resultsInfo, setResultsInfo] = useState({ results: 0, total: 0 });

  // 🆕 Estados para navegación
  const [activeSection, setActiveSection] = useState("inicio");

  // 🆕 Estados para paginación
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;

  // 🆕 Función para cargar más productos
  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * PRODUCTS_PER_PAGE;

    const newDisplayedProducts = allProducts.slice(startIndex, endIndex);
    setDisplayedProducts(newDisplayedProducts);
    setCurrentPage(nextPage);
  };

  // Cargar productos al inicio
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        { method: "GET" }
      );
      const data = await res.json();
      console.log("Datos recibidos:", data);

      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];

      const processedProducts = formatted
        .filter((p) => p && p.titulo)
        .map((p, index) => ({
          id: p.paquete_externo_id || `package-${index}`,
          titulo: p.titulo?.replace(/<[^>]*>/g, "").trim() || "Sin título",
          imagen_principal:
            p.imagen_principal || "https://via.placeholder.com/200",
          url: p.url?.trim() || "#",
          cant_noches: parseInt(p.cant_noches) || 0,
          doble_precio: parseFloat(p.doble_precio || p.precio || 0),
          destinoCiudad:
            p.destinos?.destino?.ciudad || p.ciudad || "Desconocido",
          destinoPais: p.destinos?.destino?.pais || p.pais || "Desconocido",
          rawData: p,
        }));

      // 🆕 Configurar paginación
      setAllProducts(processedProducts);
      const initialProducts = processedProducts.slice(0, PRODUCTS_PER_PAGE);
      setDisplayedProducts(initialProducts);
      setCurrentPage(1);

      setResultsInfo({
        results: processedProducts.length,
        total: processedProducts.length,
      });

      const processedImages = formatted
        .filter((p) => p && p.imagen_principal)
        .slice(0, 7)
        .map((p, index) => ({
          id: p.paquete_externo_id || `image-${index}`,
          url: p.imagen_principal,
          titulo:
            p.titulo?.replace(/<[^>]*>/g, "").trim() || `Imagen ${index + 1}`,
          descripcion: "",
          alt:
            p.titulo?.replace(/<[^>]*>/g, "").trim() || `Imagen ${index + 1}`,
        }));

      setImages(processedImages);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError(`Error al cargar productos: ${err.message}`);
      setAllProducts([]);
      setDisplayedProducts([]);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 Función de búsqueda con paginación
  const handleSearch = async (filters) => {
    console.log("🔍 USANDO FILTRO COMPLETO EN REACT");
    console.log("Filtros aplicados:", filters);
    setActiveSection("paquetes"); // 🆕 Ir a sección paquetes
    setLoading(true);
    setError(null);

    try {
      // Obtener TODOS los paquetes sin filtro
      const res = await fetch(
        "https://introduced-furnished-pasta-rt.trycloudflare.com/webhook/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            destino: "",
            fecha: "",
            salida: "",
            viajeros: "2 adultos",
            tipo: "paquetes",
            buscar: false,
          }),
        }
      );

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      const paquetes = data?.root?.paquetes?.paquete || data?.paquetes || [];
      const formatted = Array.isArray(paquetes) ? paquetes : [paquetes];
      const totalCount = formatted.length;

      console.log("🔍 Total de paquetes antes del filtro:", totalCount);

      // APLICAR TODOS LOS FILTROS
      let paquetesFiltrados = formatted;

      // Filtro por destino
      if (filters.destino && filters.destino.trim() !== "") {
        const destinoBuscado = filters.destino.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const destinos = paquete.destinos?.destino;
          if (!destinos) return false;

          if (Array.isArray(destinos)) {
            return destinos.some((dest) => {
              const ciudad = (dest.ciudad || "").toLowerCase();
              const pais = (dest.pais || "").toLowerCase();
              return (
                ciudad.includes(destinoBuscado) || pais.includes(destinoBuscado)
              );
            });
          } else {
            const ciudad = (destinos.ciudad || "").toLowerCase();
            const pais = (destinos.pais || "").toLowerCase();
            return (
              ciudad.includes(destinoBuscado) || pais.includes(destinoBuscado)
            );
          }
        });
        console.log(
          `✅ Filtro destino "${filters.destino}": ${paquetesFiltrados.length} paquetes`
        );
      }

      // Filtro por salida (origen)
      if (filters.salida && filters.salida.trim() !== "") {
        const salidaBuscada = filters.salida.toLowerCase();
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const origen = (paquete.origen || "").toLowerCase();
          return origen.includes(salidaBuscada);
        });
        console.log(
          `✅ Filtro salida "${filters.salida}": ${paquetesFiltrados.length} paquetes`
        );
      }

      // Filtro por fecha
      if (filters.fecha && filters.fecha.trim() !== "") {
        const fechaBuscada = filters.fecha;
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const salidas = paquete.salidas?.salida;
          if (!salidas) return false;

          if (Array.isArray(salidas)) {
            return salidas.some((salida) => {
              const fechaDesde = salida.fecha_desde || "";
              const fechaHasta = salida.fecha_hasta || "";
              return (
                fechaDesde.includes(fechaBuscada) ||
                fechaHasta.includes(fechaBuscada)
              );
            });
          } else {
            const fechaDesde = salidas.fecha_desde || "";
            const fechaHasta = salidas.fecha_hasta || "";
            return (
              fechaDesde.includes(fechaBuscada) ||
              fechaHasta.includes(fechaBuscada)
            );
          }
        });
        console.log(
          `✅ Filtro fecha "${filters.fecha}": ${paquetesFiltrados.length} paquetes`
        );
      }

      // Filtro por precio mínimo
      if (filters.precioMin && filters.precioMin.trim() !== "") {
        const precioMin = parseFloat(filters.precioMin);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const precio = parseFloat(paquete.doble_precio || 0);
          return precio >= precioMin;
        });
        console.log(
          `✅ Filtro precio mínimo ${precioMin}: ${paquetesFiltrados.length} paquetes`
        );
      }

      // Filtro por precio máximo
      if (filters.precioMax && filters.precioMax.trim() !== "") {
        const precioMax = parseFloat(filters.precioMax);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const precio = parseFloat(paquete.doble_precio || 0);
          return precio <= precioMax;
        });
        console.log(
          `✅ Filtro precio máximo ${precioMax}: ${paquetesFiltrados.length} paquetes`
        );
      }

      // Filtro por duración mínima (noches)
      if (filters.duracionMin && filters.duracionMin.trim() !== "") {
        const duracionMin = parseInt(filters.duracionMin);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const noches = parseInt(paquete.cant_noches || 0);
          return noches >= duracionMin;
        });
        console.log(
          `✅ Filtro duración mínima ${duracionMin} noches: ${paquetesFiltrados.length} paquetes`
        );
      }

      // Filtro por duración máxima (noches)
      if (filters.duracionMax && filters.duracionMax.trim() !== "") {
        const duracionMax = parseInt(filters.duracionMax);
        paquetesFiltrados = paquetesFiltrados.filter((paquete) => {
          const noches = parseInt(paquete.cant_noches || 0);
          return noches <= duracionMax;
        });
        console.log(
          `✅ Filtro duración máxima ${duracionMax} noches: ${paquetesFiltrados.length} paquetes`
        );
      }

      const resultsCount = paquetesFiltrados.length;
      console.log(
        "🎯 RESULTADO FINAL:",
        resultsCount,
        "de",
        totalCount,
        "paquetes"
      );

      setResultsInfo({ results: resultsCount, total: totalCount });

      // Procesar productos filtrados
      const processedProducts = paquetesFiltrados
        .filter((p) => p && p.titulo)
        .map((p, index) => ({
          id: p.paquete_externo_id || `package-${index}`,
          titulo: p.titulo?.replace(/<[^>]*>/g, "").trim() || "Sin título",
          imagen_principal:
            p.imagen_principal || "https://via.placeholder.com/200",
          url: p.url?.trim() || "#",
          cant_noches: parseInt(p.cant_noches) || 0,
          doble_precio: parseFloat(p.doble_precio || p.precio || 0),
          destinoCiudad:
            p.destinos?.destino?.ciudad || p.ciudad || "Desconocido",
          destinoPais: p.destinos?.destino?.pais || p.pais || "Desconocido",
          rawData: p,
        }));

      // 🆕 Aplicar paginación a resultados filtrados
      setAllProducts(processedProducts);
      const initialProducts = processedProducts.slice(0, PRODUCTS_PER_PAGE);
      setDisplayedProducts(initialProducts);
      setCurrentPage(1);

      // Mensajes cuando no hay resultados
      if (processedProducts.length === 0) {
        const activeFilters = Object.entries(filters)
          .filter(
            ([key, value]) => value && value.trim() !== "" && key !== "tipo"
          )
          .map(([key, value]) => {
            const filterNames = {
              destino: "Destino",
              salida: "Salida",
              fecha: "Fecha",
              precioMin: "Precio mínimo",
              precioMax: "Precio máximo",
              duracionMin: "Duración mínima",
              duracionMax: "Duración máxima",
            };
            return `${filterNames[key] || key}: ${value}`;
          });

        if (activeFilters.length > 0) {
          setError(
            `No se encontraron paquetes que coincidan con los filtros aplicados:\n\n${activeFilters.join(
              "\n"
            )}\n\nIntenta ajustar o eliminar algunos filtros para ver más resultados.`
          );
        } else {
          setError("No se encontraron paquetes disponibles en este momento.");
        }
      }
    } catch (err) {
      console.error("Error al buscar paquetes:", err);
      setError(`No se pudo realizar la búsqueda: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función reset para mostrar todos los paquetes
  const handleReset = async () => {
    await fetchProducts();
    setActiveSection("paquetes");
  };

  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  // 🆕 Función para cambiar de sección
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // 🆕 Renderizado condicional del contenido según la sección activa
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <p>Cargando productos...</p>
        </div>
      );
    }

    if (error && activeSection === "paquetes") {
      return (
        <div className="error-container">
          <p style={{ whiteSpace: "pre-line" }}>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      );
    }

    switch (activeSection) {
      case "inicio":
        return (
          <>
            <CarouselList images={images} />
            {/* <InicioComponent /> */}
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <h1>Bienvenidos a Travel Connect</h1>
              <p>
                Aquí irá tu componente InicioComponent cuando lo tengas listo
              </p>
            </div>
          </>
        );

      case "paquetes":
        const hasMoreProducts = displayedProducts.length < allProducts.length;

        return (
          <>
            <CarouselList images={images} />
            <SearchBar
              onSearch={handleSearch}
              onReset={handleReset}
              resultsCount={resultsInfo.results}
              totalCount={resultsInfo.total}
            />
            <main className="main-content">
              {/* 🆕 Mostrar información de paginación */}
              <div className="pagination-info">
                <p>
                  Mostrando {displayedProducts.length} de {allProducts.length}{" "}
                  paquetes
                  {resultsInfo.results !== resultsInfo.total &&
                    ` (${allProducts.length} coincidencias de ${resultsInfo.total} totales)`}
                </p>
              </div>

              <ProductList
                products={displayedProducts} // 🆕 Usar productos paginados
                addToCart={addToCart}
                onSelect={(product) => setSelectedProduct(product)}
              />

              {/* 🆕 Botón "Ver más" */}
              {hasMoreProducts && (
                <div className="load-more-container">
                  <button
                    className="load-more-btn"
                    onClick={loadMoreProducts}
                    disabled={loading}
                  >
                    {loading
                      ? "Cargando..."
                      : `Ver más paquetes (${
                          allProducts.length - displayedProducts.length
                        } restantes)`}
                  </button>
                </div>
              )}

              {/* 🆕 Mensaje cuando se muestran todos */}
              {!hasMoreProducts && allProducts.length > PRODUCTS_PER_PAGE && (
                <div className="all-products-loaded">
                  <p>✅ Se han mostrado todos los paquetes disponibles</p>
                  <button
                    className="back-to-top-btn"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    ⬆️ Volver al inicio
                  </button>
                </div>
              )}
            </main>
          </>
        );

      case "contacto":
        return <Formulario />;

      default:
        return (
          <>
            <CarouselList images={images} />
            {/* <InicioComponent /> */}
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <h1>Bienvenidos a Travel Connect</h1>
              <p>
                Aquí irá tu componente InicioComponent cuando lo tengas listo
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Navbar
        cart={cart}
        removeFromCart={removeFromCart}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {renderContent()}

      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Footer />
    </>
  );
}

export default App;
