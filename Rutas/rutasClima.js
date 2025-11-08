const Rutas = require('express');
const { obtenerClima, eliminarClima, crearClima, actualizarClima } = require('../Controladores/controladorClima.js');

const rutas = Rutas();

// GET -> consultar clima actual
rutas.get("/:ciudad", obtenerClima);

// POST -> crear nueva ciudad
rutas.post("/", crearClima);

// PUT -> actualizar datos de ciudad existente
rutas.put("/:ciudad", actualizarClima);

// DELETE -> eliminar ciudad del historial
rutas.delete("/:ciudad", eliminarClima);

module.exports = rutas;