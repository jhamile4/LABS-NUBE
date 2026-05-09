const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const routes = require('./src/routes/index');
app.use('/api', routes);

app.get('/', (req, res) => res.json({ mensaje: 'TechStore API funcionando ✅' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));