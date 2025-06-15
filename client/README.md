# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Full-Stack Todo App

## Backend (Express + Prisma + PostgreSQL)

1. Go to the `server` directory:
   ```bash
   cd server
   ```
2. Start the backend server:
   ```bash
   npm start
   ```
   The backend runs on [http://localhost:4000](http://localhost:4000)

## Frontend (React + MUI)

1. Go to the `client` directory:
   ```bash
   cd client
   ```
2. Start the frontend dev server:
   ```bash
   npm start
   ```
   The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

## Features
- Add, update, delete, and list todos
- Filter by Done/Upcoming
- Validation on both client and server
- Loading spinner for async actions
- MUI for styling

## Environment
- Make sure PostgreSQL is running and accessible as configured in `/server/.env`
