const express = require('express');
const climaRutas = require('./Rutas/rutasClima.js');
const sql = require('mssql'); // NUEVO: mssql para conexión
const configDB = require('./database/config.js').configDB;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Ruta raíz para comprobar servidor
app.get('/', (req, res) => res.send('App-Clima server running'));

// Ruta principal
app.use("/api/clima", climaRutas);

// Iniciar servidor inmediatamente (no bloquear por la BD)
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
	// Intentar conectar la BD en background
	const pool = new sql.ConnectionPool(configDB);
	// console.log(pool)
	pool.connect()
		.then(() => {
			app.locals.db = pool;
			console.log('Conexión a la base de datos establecida y pool guardado en app.locals.db');
		})
		.catch(err => {
			console.error('No se pudo conectar a la base de datos. Se usará fallback en memoria si aplica.', err.message || err);
			// no exit -> permitimos usar el arreglo en memoria
		});
});