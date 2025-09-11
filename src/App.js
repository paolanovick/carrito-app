import React, { useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import "./index.css";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (product) =>
    setCart(cart.filter((item) => item.id !== product.id));

  return (
    <div>
      <nav>
        <h2>Travel Store</h2>
        <ul>
          <li>Inicio</li>
          <li>Productos</li>
          <li>Contacto</li>
          <li>Carrito ({cart.length})</li>
        </ul>
      </nav>

      <header>
        <h1>Bienvenido a Travel Store</h1>
        <p>Encuentra los mejores paquetes de viajes a todo el mundo</p>
      </header>

      <main>
        <ProductList addToCart={addToCart} />
        <Cart cart={cart} removeFromCart={removeFromCart} />
        {cart.length > 0 && <CheckoutForm cart={cart} />}
      </main>

      <footer>
        <p>© 2025 Travel Store - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default App;
