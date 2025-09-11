import React, { useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import "./index.css";

function App() {
  const [cart, setCart] = useState([]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Quitar producto del carrito
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <div>
      {/* Navbar */}
      <nav>
        <h2>Travel Store</h2>
        <ul>
          <li>Inicio</li>
          <li>Productos</li>
          <li>Contacto</li>
          <li>Carrito ({cart.length})</li>
        </ul>
      </nav>

      {/* Header */}
      <header>
        <h1>Bienvenido a Travel Store</h1>
        <p>Encuentra los mejores paquetes de viajes a todo el mundo</p>
      </header>

      {/* Main content */}
      <main
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          padding: "20px",
        }}
      >
        <div style={{ flex: 3 }}>
          <ProductList addToCart={addToCart} />
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <Cart cart={cart} removeFromCart={removeFromCart} />
          {cart.length > 0 && <CheckoutForm cart={cart} />}
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>© 2025 Travel Store - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default App;
