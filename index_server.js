const express = require('express');
const climaRutas = require('./Rutas/rutasClima.js');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Ruta principal
app.use("/api/clima", climaRutas);

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`));