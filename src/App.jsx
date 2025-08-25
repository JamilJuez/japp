import React, { useState, useEffect } from "react";
import Catalogo from "./components/catalogo";
import Login from "./components/Login";  // Asegúrate de importar correctamente
import "./App.css";
import { useNavigate } from "react-router-dom"; // Importamos el hook useNavigate

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Inicializamos el hook de navegación

  // Lista de usuarios con sus credenciales
  const users = {
    3816: "013816",
    3890: "013890",
    3853: "013853",
    3807: "013807",
    guest: "tmppass"
  };

  // Comprobar si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
    if (storedAuthStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para manejar el login
  const handleLogin = (usuario, clave) => {
    // Validar usuario y clave en el objeto users
    if (users[usuario] && users[usuario] === clave) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");  // Guardar el estado en localStorage
      navigate("/catalogo");  // Redirigir al home si las credenciales son correctas
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
          <Catalogo /> {/* Redirigir a la página de catalogo */}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
