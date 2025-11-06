const Rutas = require('express');
const { obtenerClima, eliminarClima } = require('../Controladores/controladorClima.js');

const rutas = Rutas();

// GET -> consultar clima actual
rutas.get("/:ciudad", obtenerClima);

// DELETE -> eliminar ciudad del historial
rutas.delete("/:ciudad", eliminarClima);

module.exports = rutas;