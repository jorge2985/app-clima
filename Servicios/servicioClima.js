const { ciudadEncontrarClima, ciudadEliminada } = require('../Repositorios/repositorioClima.js');

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

module.exports = { obtenerDatosClima, eliminarCiudad };