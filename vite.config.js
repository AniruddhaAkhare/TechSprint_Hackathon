import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // '@': path.resolve(__dirname, 'src'), // Ensure this exists
    },
  },
  server:{
    hmr:{
      clientPort:5173,
      protocol: 'ws',
      host:'localhost'
    },
    watch:{
      usePolling: true
    }
  }
})


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';


// export default defineConfig({
//   plugins: [react()],
  
// });


// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// });