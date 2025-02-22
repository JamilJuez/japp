import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Asegura rutas relativas
  server: {
    historyApiFallback: true, // Soluciona problemas de rutas en desarrollo
  },
});
