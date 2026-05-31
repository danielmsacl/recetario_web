const express = require('express');
const app = express();
const PORT = 3000;
const recetasRoutes = require('./routes/recetasRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'Hola mundo' });
});

app.use('/api', recetasRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});