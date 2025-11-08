const { obtenerDatosClima, eliminarCiudad, crearCiudad, actualizarCiudad } = require('../Servicios/servicioClima.js');

// GET
const obtenerClima = async (req, res) => {
    const { ciudad } = req.params;
    try {
        const data = await obtenerDatosClima(ciudad);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
const eliminarClima = async (req, res) => {
    const { ciudad } = req.params;
    try {
        const eliminado = await eliminarCiudad(ciudad);
        res.json({ message: `${eliminado.ciudad} eliminada del historial` });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// POST - Crear nueva ciudad
const crearClima = async (req, res) => {
    const { ciudad, temp, viento } = req.body;
    try {
        const nuevaCiudad = await crearCiudad({ ciudad, temp, viento });
        res.status(200).json({ message: `${nuevaCiudad.ciudad} agregada exitosamente`, data: nuevaCiudad });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// PUT - Actualizar datos de ciudad existente
const actualizarClima = async (req, res) => {
    const { ciudad } = req.params;
    const datosActualizados = req.body;
    try {
        const actualizada = await actualizarCiudad(ciudad, datosActualizados);
        res.json({ message: `${actualizada.ciudad} actualizada exitosamente`, data: actualizada });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = { obtenerClima, eliminarClima, crearClima, actualizarClima };