# CineReview — Frontend (Obligatorio 2)

Frontend en React para CineReview. Consume la API del Obligatorio 1
(`https://dfs-obl-210406-backend.vercel.app/v1`).

## Stack

- Vite + React 19
- Redux Toolkit + react-redux
- react-router
- react-hook-form + Joi (`@hookform/resolvers/joi`)
- axios (instancia con interceptor del token)
- chart.js + react-chartjs-2
- react-toastify

## Correr el proyecto

```bash
npm install
npm run dev
```

La URL de la API se puede cambiar con `VITE_API_URL` (ver `.env.example`).

## Estructura

```
src/
  assets/       imágenes (logo, telón, cortinas)
  components/   componentes reutilizables (layout, navbar, rutas protegidas)
  config/       instancia de axios
  features/     slices de Redux
  pages/        pantallas
  store/        store de Redux
  validators/   esquemas Joi de los formularios
```
