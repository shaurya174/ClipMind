import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Preserves the REACT_APP_ prefix from the spec instead of Vite's default VITE_ prefix.
  envPrefix: "REACT_APP_",
  server: {
    port: 5173,
  },
});
