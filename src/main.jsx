import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importamos el enrutador
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Registrar el Service Worker para la PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => {
      console.log("Service Worker registrado con éxito.");
    })
    .catch((error) => {
      console.error("Error al registrar el Service Worker:", error);
    });
}