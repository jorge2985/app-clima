const { obtenerDatosClima, eliminarCiudad } = require('../Servicios/servicioClima.js');

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

module.exports = { obtenerClima, eliminarClima };