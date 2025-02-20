import React, { useState, useEffect } from "react";
import Catalogo from "./components/catalogo";
import Login from "./components/Login";  // Asegúrate de importar correctamente
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Comprobar si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
    if (storedAuthStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para manejar el login
  const handleLogin = (usuario, clave) => {
    if (usuario === "admin" && clave === "1234") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");  // Guardar el estado en localStorage
    } else {
      alert("Usuario o clave incorrectos");
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");  // Eliminar el estado de localStorage
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
          <Catalogo />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
