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

// Crear nueva ciudad (ANTES de la ruta con parámetro)
router.post('/crear', controlador.nuevaCiudad);

// Actualizar ciudad por nombre (ANTES de la ruta con parámetro)
router.put('/actualizar/:city', controlador.actualizarClima);

// Eliminar ciudad por nombre (ANTES de la ruta con parámetro)
router.delete('/eliminar/:city', controlador.borrarCiudad);

// Obtener clima por nombre de ciudad (AL FINAL - ruta genérica con parámetro)
router.get('/:city', controlador.obtenerClima);

module.exports = router;