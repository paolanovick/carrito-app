import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import Banner from "./components/Banner";
import { XMLParser } from "fast-xml-parser";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  // Cargar XML de paquetes
  useEffect(() => {
    fetch("/allseasons.xml") // o la URL real si funciona con CORS
      .then((res) => res.text())
      .then((data) => {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "",
        });
        const json = parser.parse(data);

        let paquetes = json.root.paquetes.paquete;
        if (!Array.isArray(paquetes)) paquetes = [paquetes];

        const formattedProducts = paquetes.map((p) => ({
          id: p.paquete_externo_id,
          title: p.titulo?.replace(/<[^>]+>/g, ""),
          description: p.incluye?.replace(/<[^>]+>/g, ""),
          price: parseFloat(p.doble_precio) || 0,
          image:
            p.imagen_principal ||
            "https://via.placeholder.com/1200x300?text=Sin+Imagen",
          url: p.url,
        }));

        setProducts(formattedProducts);
      })
      .catch((err) => console.error("Error al cargar XML:", err));
  }, []);

  // Funciones del carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="App">
      <Navbar cartCount={cartItems.length} />
      <Banner products={products} /> {/* Slider dinámico */}
      <main style={{ display: "flex", gap: "20px", padding: "0 40px" }}>
        <div style={{ flex: 3 }}>
          <ProductList addToCart={addToCart} />
        </div>
        <div
          style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: "20px" }}
        >
          <Cart
            cartItems={cartItems}
            total={total}
            removeFromCart={removeFromCart}
            decreaseQuantity={decreaseQuantity}
          />
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
