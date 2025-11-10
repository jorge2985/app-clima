const express = require('express');
const climaRutas = require('./Rutas/rutasClima.js');
const sql = require('mssql'); // NUEVO: mssql para conexión
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Configuración de la BD (usando los datos proporcionados)
const dbConfig = {
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

// Ruta raíz para comprobar servidor
app.get('/', (req, res) => res.send('App-Clima server running'));

// Ruta principal
app.use("/api/clima", climaRutas);

// Iniciar servidor inmediatamente (no bloquear por la BD)
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
	// Intentar conectar la BD en background
	const pool = new sql.ConnectionPool(dbConfig);
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