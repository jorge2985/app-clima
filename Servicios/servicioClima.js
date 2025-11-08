const { ciudadEncontrarClima, ciudadEliminada, ciudadCreada, ciudadActualizada } = require('../Repositorios/repositorioClima.js');

// Retornamos las funciones con los nombres que usa el controlador
const obtenerDatosClima = async (ciudad) => {
    // Ejemplo de consulta simulada a BD o API externa
    const clima = await ciudadEncontrarClima(ciudad);
    if (!clima) throw new Error("Ciudad no encontrada");
    return clima;
}

const eliminarCiudad = async (ciudad) => {
    const eliminada = await ciudadEliminada(ciudad);
    if (!eliminada) throw new Error("No existe la ciudad en el historial");
    return eliminada;
}

// CREATE - Crear nueva ciudad
const crearCiudad = async (datosClima) => {
    const { ciudad, temp, viento } = datosClima;
    if (!ciudad || temp === undefined || viento === undefined) {
        throw new Error("Faltan datos requeridos: ciudad, temp, viento");
    }
    
    const nuevaCiudad = await ciudadCreada({ ciudad, temp, viento });
    if (!nuevaCiudad) throw new Error("La ciudad ya existe");
    return nuevaCiudad;
}

// UPDATE - Actualizar datos de ciudad
const actualizarCiudad = async (ciudad, datosActualizados) => {
    const actualizada = await ciudadActualizada(ciudad, datosActualizados);
    if (!actualizada) throw new Error("Ciudad no encontrada para actualizar");
    return actualizada;
}

module.exports = { obtenerDatosClima, eliminarCiudad, crearCiudad, actualizarCiudad };