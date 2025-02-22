import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Asegura rutas relativas (importante para Netlify y otras plataformas)
  server: {
    historyApiFallback: true, // Soluciona problemas de rutas en desarrollo
  },
});
