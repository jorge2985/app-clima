const express = require('express');
const router = express.Router();
const servicio = require('../Servicios/servicioClima');

// Log middleware ligero para debug
router.use((req, res, next) => {
  console.log(`[RUTAS-CLIMA] ${req.method} ${req.originalUrl}`);
  next();
});

// Lista todas las ciudades
router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const lista = await servicio.listarCiudades(db);
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la lista de ciudades' });
  }
});

// Obtener clima por nombre de ciudad
router.get('/:city', async (req, res) => {
  const db = req.app.locals.db;
  const city = decodeURIComponent(req.params.city);
  try {
    const item = await servicio.obtenerDatosClima(city, db);
    if (!item) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error al buscar la ciudad' });
  }
});

// Crear nueva ciudad
router.post('/', async (req, res) => {
  const db = req.app.locals.db;
  const nueva = req.body;
  try {
    const created = await servicio.crearCiudad(nueva, db);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    const msg = err.message || 'Error al crear la ciudad';
    if (msg.includes('Faltan datos')) return res.status(400).json({ error: msg });
    if (msg.includes('ya existe')) return res.status(409).json({ error: msg });
    res.status(500).json({ error: msg });
  }
});

// Actualizar ciudad por nombre
router.put('/:city', async (req, res) => {
  const db = req.app.locals.db;
  const city = decodeURIComponent(req.params.city);
  const datos = req.body;

  // Validación de tipos de datos
  if (datos.temp !== undefined && (typeof datos.temp !== 'number' || isNaN(datos.temp))) {
    return res.status(400).json({ error: 'Temperatura debe ser un número válido' });
  }
  if (datos.viento !== undefined && (typeof datos.viento !== 'number' || isNaN(datos.viento))) {
    return res.status(400).json({ error: 'Viento debe ser un número válido' });
  }
  if (datos.ciudad !== undefined && (typeof datos.ciudad !== 'string' || datos.ciudad.trim().length === 0)) {
    return res.status(400).json({ error: 'Ciudad debe ser un string no vacío' });
  }

  try {
    const updated = await servicio.actualizarCiudad(city, datos, db);
    res.json(updated);
  } catch (err) {
    console.error(err);
    const msg = err.message || 'Error al actualizar la ciudad';
    if (msg.includes('no encontrada')) return res.status(404).json({ error: msg });
    res.status(500).json({ error: msg });
  }
});

// Eliminar ciudad por nombre
router.delete('/:city', async (req, res) => {
  const db = req.app.locals.db;
  const city = decodeURIComponent(req.params.city);
  try {
    const deleted = await servicio.eliminarCiudad(city, db);
    res.json(deleted);
  } catch (err) {
    console.error(err);
    const msg = err.message || 'Error al eliminar la ciudad';
    if (msg.includes('No existe')) return res.status(404).json({ error: msg });
    res.status(500).json({ error: msg });
  }
});

module.exports = router;