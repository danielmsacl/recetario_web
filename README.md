# recetario

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

## Ejecución local

### Backend (Express)

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos

# Iniciar el servidor
node src/app.js

# Iniciar el servidor de desarrollo
cd client
npm run dev