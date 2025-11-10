const express = require('express');
const router = express.Router();
const repo = require('../Repositorios/repositorioClima');

// Log middleware ligero para debug
router.use((req, res, next) => {
  console.log(`[RUTAS-CLIMA] ${req.method} ${req.originalUrl}`);
  next();
});

// Lista todas las ciudades
router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const lista = await repo.ciudadTraerLista(db);
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
    const item = await repo.ciudadEncontrarClima(city, db);
    if (!item) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar la ciudad' });
  }
});

// Crear nueva ciudad
router.post('/', async (req, res) => {
  const db = req.app.locals.db;
  const nueva = req.body;
  try {
    const created = await repo.ciudadCreada(nueva, db);
    if (!created) return res.status(409).json({ error: 'La ciudad ya existe' });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la ciudad' });
  }
});

// Actualizar ciudad por nombre
router.put('/:city', async (req, res) => {
  const db = req.app.locals.db;
  const city = decodeURIComponent(req.params.city);
  const datos = req.body;
  try {
    const updated = await repo.ciudadActualizada(city, datos, db);
    if (!updated) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la ciudad' });
  }
});

// Eliminar ciudad por nombre
router.delete('/:city', async (req, res) => {
  const db = req.app.locals.db;
  const city = decodeURIComponent(req.params.city);
  try {
    const deleted = await repo.ciudadEliminada(city, db);
    if (!deleted) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la ciudad' });
  }
});

module.exports = router;