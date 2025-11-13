const express = require('express');
const climaRutas = require('./Rutas/rutasClima.js');
const servicio = require('./Servicios/servicioClima');
const sql = require('mssql');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Manejo de errores globales para capturar crashes y mostrarlos en consola
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

// Intentar cargar config DB si existe, si no usar fallback (no romperá el arranque)
let dbConfig;
try {
  // si tienes un archivo ./database/config.js que exporta { configDB } lo usará
  const cfg = require('./database/config.js');
  dbConfig = cfg && cfg.configDB ? cfg.configDB : null;
} catch (e) {
  dbConfig = null;
}

if (!dbConfig) {
  // fallback — tus datos de conexión (los que compartiste)
  dbConfig = {
    user: 'backend2c2025_SQLLogin_1',
    password: 'qyh8aap7in',
    server: 'dbAppClima.mssql.somee.com',
    database: 'dbAppClima',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  };
  console.warn('Usando dbConfig fallback. Si quieres usar otro config, crea ./database/config.js que exporte { configDB }');
}

// Ruta raíz para comprobar servidor
app.get('/', (req, res) => res.send('App-Clima server running'));

// Ruta DELETE compatibilidad: /api/clima/eliminar/:city
app.delete('/api/clima/eliminar/:city', async (req, res) => {
  const city = decodeURIComponent(req.params.city || '');
  const db = req.app.locals.db;
  try {
    const deleted = await servicio.eliminarCiudad(city, db);
    if (!deleted) return res.status(404).json({ error: 'Ciudad no encontrada' });
    return res.json(deleted);
  } catch (err) {
    console.error('Error eliminando ciudad (ruta compatibilidad):', err);
    return res.status(500).json({ error: err.message || 'Error al eliminar la ciudad' });
  }
});

// Montar rutas principales
app.use("/api/clima", climaRutas);

// Iniciar servidor inmediatamente (para que REST client no reciba connection refused)
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  // Intentar conectar la BD en background (no abortar si falla)
  const pool = new sql.ConnectionPool(dbConfig);
  pool.connect()
    .then(() => {
      app.locals.db = pool;
      console.log('Conexión a la base de datos establecida y pool guardado en app.locals.db');
    })
    .catch(err => {
      console.error('No se pudo conectar a la base de datos. Usando fallback en memoria. Error:', err && err.message ? err.message : err);
      // no exit -> permitimos usar el arreglo en memoria y seguir respondiendo
    });
});