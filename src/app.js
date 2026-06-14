const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;  
const recetasRoutes = require('./routes/recetasRoutes'); 
const ingredientesRoutes = require('./routes/ingredientesRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors')
const recetaDelDiaRoutes = require('./routes/recetaDelDiaRoutes');

//middlewares de error
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

// Configuración CORS 
app.use(cors({
  origin: ['https://recetario-web-six.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static('src/uploads'));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Hola mundo' });
});

app.use('/api', recetasRoutes); 
app.use('/api', ingredientesRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', recetaDelDiaRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {  
  console.log(`Servidor en http://0.0.0.0:${PORT}`);
});