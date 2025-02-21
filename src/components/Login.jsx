import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Asegúrate de que el archivo CSS esté correctamente configurado

const Login = ({ onLogin }) => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  React.useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    // Llama a la función onLogin desde App.jsx
    onLogin(username, password);  // Si las credenciales son correctas, se manejará en App.jsx
  };

  return (
    <div className="wrap">
      <div className="avatar">
        <img src="/logo.png" alt="Logo" />
      </div>
      <form onSubmit={handleLogin}>
        <input
          ref={usernameRef}
          type="text"
          name="username"
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Sign in</button>
      </form>
      <div className="message">{message}</div>
    </div>
  );
};

export default Login;
