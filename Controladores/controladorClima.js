const {
    listarCiudades,
    obtenerDatosClima,
    eliminarCiudad,
    crearCiudad,
    actualizarCiudad
} = require('../Servicios/servicioClima.js');

// GET - Listar todas las ciudades
const listarClima = async (req, res) => {
    const db = req.app.locals.db;
    try {
        const lista = await listarCiudades(db);
        res.json(lista);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener la lista de ciudades' });
    }
};

// GET
const obtenerClima = async (req, res) => {
    const db = req.app.locals.db;
    const city = decodeURIComponent(req.params.city);

    if (city.ciudad !== undefined && (typeof city.ciudad !== 'string' || city.ciudad.trim().length === 0)) {
        return res.status(400).json({ error: 'Ciudad debe ser un string no vacío' });
    }

    try {
        const item = await obtenerDatosClima(city, db);
        if (!item) return res.status(404).json({ error: 'Ciudad no encontrada' });
        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Error al buscar la ciudad' });
    }
};

// POST - Crear nueva ciudad
const nuevaCiudad = async (req, res) => {
    const db = req.app.locals.db;
    const nueva = req.body;

    // Validación de tipos de datos
    if (nueva.temp !== undefined && (typeof nueva.temp !== 'number' || isNaN(nueva.temp))) {
        return res.status(400).json({ error: 'Temperatura debe ser un número válido' });
    }
    if (nueva.viento !== undefined && (typeof nueva.viento !== 'number' || isNaN(nueva.viento))) {
        return res.status(400).json({ error: 'Viento debe ser un número válido' });
    }
    if (nueva.ciudad !== undefined && (typeof nueva.ciudad !== 'string' || nueva.ciudad.trim().length === 0)) {
        return res.status(400).json({ error: 'Ciudad debe ser un string no vacío' });
    }

    try {
        const created = await crearCiudad(nueva, db);
        res.status(201).json(created);
    } catch (err) {
        console.error(err);
        const msg = err.message || 'Error al crear la ciudad';
        if (msg.includes('Faltan datos')) return res.status(400).json({ error: msg });
        if (msg.includes('ya existe')) return res.status(409).json({ error: msg });
        res.status(500).json({ error: msg });
    }
};

// PUT - Actualizar datos de ciudad existente
const actualizarClima = async (req, res) => {
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
        const updated = await actualizarCiudad(city, datos, db);
        res.json(updated);
    } catch (err) {
        console.error(err);
        const msg = err.message || 'Error al actualizar la ciudad';
        if (msg.includes('no encontrada')) return res.status(404).json({ error: msg });
        res.status(500).json({ error: msg });
    }
};

// DELETE
const borrarCiudad = async (req, res) => {
    const db = req.app.locals.db;
    const city = decodeURIComponent(req.params.city);

    if (city.ciudad !== undefined && (typeof city.ciudad !== 'string' || city.ciudad.trim().length === 0)) {
        return res.status(400).json({ error: 'Ciudad debe ser un string no vacío' });
    }

    try {
        const deleted = await eliminarCiudad(city, db);
        res.json(deleted);
    } catch (err) {
        console.error(err);
        const msg = err.message || 'Error al eliminar la ciudad';
        if (msg.includes('No existe')) return res.status(404).json({ error: msg });
        res.status(500).json({ error: msg });
    }
};

module.exports = { listarClima, obtenerClima, borrarCiudad, nuevaCiudad, actualizarClima };