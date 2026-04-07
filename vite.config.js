// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default defineConfig({
//   plugins: [react()], // ✅ Only React plugin

//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },

//   server: {
//   host: true,
//   port: 5173,
//   watch: {
//     usePolling: true,
//   },
// },

//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           "vendor-crypto": ["@noble/curves", "@noble/hashes", "ox"],
//           "vendor-ui": ["react", "react-dom", "react-router-dom"],
//         },
//       },
//       onwarn(warning, defaultHandler) {
//         if (warning.code === "PLUGIN_WARNING") return;
//         defaultHandler(warning);
//       },
//     },
//   },
// });


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'redux-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    open: true
  }
})