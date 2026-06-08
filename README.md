# 🍽️ Recetario

Aplicación web para gestión de recetas con autenticación JWT, roles de usuario y panel de administración.

## Requisitos previos

- Node.js (v18 o superior)
- MySQL (v8 o superior)
- npm

## Ejecución local

### Backend (Express)

```bash
# Instalar dependencias
npm install

npm install express sequelize mysql2 cors bcryptjs jsonwebtoken dotenv

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos

# Iniciar el servidor
# terminal 1
cd client 
npm install
npm run dev

# terminal 2 
node src/app.js

```

## variables de entorno

| Variable       | Descripción                   | Local                                  |
|----------------|-------------------------------|----------------------------------------|
| `BACKEND_PORT`         | Puerto del servidor (Express) | 3001                           |
| `FRONTEND_PORT`         | Puerto del servidor (Nuxt)   | 3000                           |
| `DATABASE_URL` | URL de conexión MySQL         | mysql://root:@localhost:3306/recetario |
| `JWT_SECRET`   | Secreto para tokens JWT       | recetario2026                          |
| `NODE_ENV`     | Entorno                       | development                            |
| `CORS_ORIGIN`  | Frontend permitido            | http://localhost:5173                  |
| `VITE_API_URL` | URL del backend para frontend | http://localhost:3000                  |

### Configuración

1. Copiar `.env.example` a `.env`
2. Completar `.env` con tus valores
3. No subir `.env` al repositorio

