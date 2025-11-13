const express = require('express');
const router = express.Router();
const controlador = require('../Controladores/controladorClima');

// Log middleware ligero para debug
router.use((req, res, next) => {
  console.log(`[RUTAS-CLIMA] ${req.method} ${req.originalUrl}`);
  next();
});

// Lista todas las ciudades
router.get('/', controlador.listarClima);

// Obtener clima por nombre de ciudad
router.get('/:city', controlador.obtenerClima);

// Crear nueva ciudad
router.post('/crear', controlador.nuevaCiudad);

// Actualizar ciudad por nombre
router.put('/actualizar/:city', controlador.actualizarClima);

// Eliminar ciudad por nombre
router.delete('/eliminar/:city', controlador.borrarCiudad);

module.exports = router;