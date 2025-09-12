import React from "react";

const Navbar = ({ cartCount }) => {
  const navStyle = {
    background:
      "linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    position: "relative",
    borderBottom: "2px solid #3498db",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const logoTextStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#3498db", // Azul que combina con el logo
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    margin: 0,
  };

  const logoAccentStyle = {
    color: "#e67e22", // Naranja que combina con el logo
    fontWeight: "normal",
  };

  const navLinksStyle = {
    display: "flex",
    gap: "2rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    color: "#ecf0f1",
    cursor: "pointer",
    padding: "0.7rem 1.2rem",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    fontWeight: "500",
    fontSize: "1rem",
    position: "relative",
    textDecoration: "none",
    border: "1px solid transparent",
  };

  const cartBadgeStyle = {
    background: "linear-gradient(135deg, #e67e22, #f39c12)",
    borderRadius: "50%",
    padding: "0.3rem 0.6rem",
    fontSize: "0.8rem",
    marginLeft: "0.5rem",
    fontWeight: "bold",
    color: "white",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
    animation: cartCount > 0 ? "pulse 2s infinite" : "none",
    minWidth: "24px",
    textAlign: "center",
    display: "inline-block",
  };

  const handleLinkHover = (e, isEnter) => {
    if (isEnter) {
      e.target.style.background = "rgba(52, 152, 219, 0.2)";
      e.target.style.borderColor = "#3498db";
      e.target.style.transform = "translateY(-2px)";
      e.target.style.color = "#3498db";
    } else {
      e.target.style.background = "transparent";
      e.target.style.borderColor = "transparent";
      e.target.style.transform = "translateY(0)";
      e.target.style.color = "#ecf0f1";
    }
  };

  const handleCartHover = (e, isEnter) => {
    if (isEnter) {
      e.target.style.background = "rgba(230, 126, 34, 0.2)";
      e.target.style.borderColor = "#e67e22";
      e.target.style.transform = "translateY(-2px)";
      e.target.style.color = "#e67e22";
    } else {
      e.target.style.background = "transparent";
      e.target.style.borderColor = "transparent";
      e.target.style.transform = "translateY(0)";
      e.target.style.color = "#ecf0f1";
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(52, 152, 219, 0.5); }
            50% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.8); }
            100% { box-shadow: 0 0 5px rgba(52, 152, 219, 0.5); }
          }
          
          .logo-container:hover {
            animation: glow 1.5s ease-in-out infinite;
            border-radius: 8px;
          }
        `}
      </style>
      <nav style={navStyle}>
        <div style={logoStyle} className="logo-container">
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #3498db, #2980b9)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(52, 152, 219, 0.3)",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              T
            </span>
          </div>
          <h2 style={logoTextStyle}>
            Trip<span style={logoAccentStyle}>Now!</span>
          </h2>
        </div>

        <ul style={navLinksStyle}>
          <li
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Inicio
          </li>
          <li
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Paquetes
          </li>
          <li
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Contacto
          </li>
          <li
            style={linkStyle}
            onMouseEnter={(e) => handleCartHover(e, true)}
            onMouseLeave={(e) => handleCartHover(e, false)}
          >
            Carrito
            <span style={cartBadgeStyle}>{cartCount || 0}</span>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
