const {
  ciudadTraerLista,
  ciudadEncontrarClima,
  ciudadEliminada,
  ciudadCreada,
  ciudadActualizada
} = require('../Repositorios/repositorioClima.js');

// Listar todas las ciudades (pasa db al repo)
const listarCiudades = async (db) => {
  return await ciudadTraerLista(db);
}

// Retornamos las funciones con los nombres que usa el controlador
const obtenerDatosClima = async (ciudad, db) => {
    const clima = await ciudadEncontrarClima(ciudad, db);
    if (!clima) throw new Error("Ciudad no encontrada");
    return clima;
}

const eliminarCiudad = async (ciudad, db) => {
    const eliminada = await ciudadEliminada(ciudad, db);
    if (!eliminada) throw new Error("No existe la ciudad en el historial");
    return eliminada;
}

// CREATE - Crear nueva ciudad
const crearCiudad = async (datosClima, db) => {
    const { ciudad, temp, viento } = datosClima;
    if (!ciudad || temp === undefined || viento === undefined) {
        throw new Error("Faltan datos requeridos: ciudad, temp, viento");
    }
    
    const nuevaCiudad = await ciudadCreada({ ciudad, temp, viento }, db);
    if (!nuevaCiudad) throw new Error("La ciudad ya existe");
    return nuevaCiudad;
}

// UPDATE - Actualizar datos de ciudad
const actualizarCiudad = async (ciudad, datosActualizados, db) => {
    const actualizada = await ciudadActualizada(ciudad, datosActualizados, db);
    if (!actualizada) throw new Error("Ciudad no encontrada para actualizar");
    return actualizada;
}

module.exports = { listarCiudades, obtenerDatosClima, eliminarCiudad, crearCiudad, actualizarCiudad };