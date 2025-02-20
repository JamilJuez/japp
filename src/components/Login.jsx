import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(usuario, clave);  // Llamada para manejar el login
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Usuario"
            required
          />
        </div>
        <div>
          <label>Clave</label>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Clave"
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
