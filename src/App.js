import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import Banner from "./components/Banner";

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Banner slides (pueden ser URLs de imágenes de tu XML o fijas)
  const slides = [
    {
      title: "Ofertas de verano",
      image: "https://via.placeholder.com/1200x300?text=Verano",
    },
    {
      title: "Escapadas de invierno",
      image: "https://via.placeholder.com/1200x300?text=Invierno",
    },
    {
      title: "Paquetes familiares",
      image: "https://via.placeholder.com/1200x300?text=Familia",
    },
  ];

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
      <Banner slides={slides} />
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
