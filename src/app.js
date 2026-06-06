const express = require('express');
const app = express();
const PORT = 3001;
const recetasRoutes = require('./routes/recetasRoutes'); 
const ingredientesRoutes = require('./routes/ingredientesRoutes');
const cors = require('cors')

app.use('/uploads', express.static('src/uploads'));
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.json({ mensaje: 'Hola mundo' });
});

app.use('/api', recetasRoutes); 
app.use('/api', ingredientesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
