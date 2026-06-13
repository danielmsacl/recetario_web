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
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
actualizar node
npm install

npm install express sequelize mysql2 cors bcryptjs jsonwebtoken dotenv

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos

# Iniciar el servidor
# terminal 1
cd client 
npm install
npm install @oxc-parser/binding-win32-x64-msvc
npm rebuild better-sqlite3
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

## Cambios de esquema (GEN-12)

### AGREGAR CAMPO - dificultad en recetas

**Fecha:** 2026-06-12  
**Tipo:** AC (Agregar Campo)

**Descripción:**  
Se agregó el campo `dificultad` a la tabla `recetas` para clasificar las recetas por nivel de dificultad.

**Valores posibles:** `fácil` 😇, `media` 😐, `difícil` 👹  
**Valor por defecto:** `media`

**Migración:** `20260612225304-add-dificultad-to-recetas.js`

**Comandos para aplicar:**
```bash
npx sequelize-cli db:migrate
```