const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;  
const recetasRoutes = require('./routes/recetasRoutes'); 
const ingredientesRoutes = require('./routes/ingredientesRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors')

//middlewares de error
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

app.use('/uploads', express.static('src/uploads'));
app.use(express.json());
app.use(cors())
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Hola mundo' });
});

app.use('/api', recetasRoutes); 
app.use('/api', ingredientesRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});