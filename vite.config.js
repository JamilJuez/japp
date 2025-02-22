import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".",  // Esto especifica que el directorio raíz es donde está tu index.html
  base: "./", // Para asegurar rutas relativas
  build: {
    outDir: "dist", // Carpeta de salida para la compilación
    rollupOptions: {
      input: "./index.html", // Esto indica que el archivo de entrada es index.html en la raíz
    },
  },
  server: {
    historyApiFallback: true, // Soluciona problemas de rutas en desarrollo
  },
});
