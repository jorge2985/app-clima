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

// CREATE - Crear nueva ciudad
const crearCiudad = async (datosClima, db) => {
    const { ciudad, temp, viento } = datosClima;
    if (!ciudad || temp === undefined || viento === undefined) {
        throw new Error("Faltan datos requeridos: ciudad, temp, viento");
    }

    let existe = false;
    try {
        existe = await obtenerDatosClima(ciudad, db);
    } catch (err) {
        // Si el error es "Ciudad no encontrada", ignorar y continuar
        if (!err.message.includes("Ciudad no encontrada")) throw err;
    }
    if (existe) throw new Error("La ciudad: " + ciudad + ", ya existe");

    const nuevaCiudad = await ciudadCreada({ ciudad, temp, viento }, db);
    return nuevaCiudad;
}

// UPDATE - Actualizar datos de ciudad
const actualizarCiudad = async (ciudad, datosActualizados, db) => {
    const actualizada = await ciudadActualizada(ciudad, datosActualizados, db);
    if (!actualizada) throw new Error("Ciudad no encontrada para actualizar");
    return actualizada;
}

// DELETE - Eliminar ciudad por nombre
const eliminarCiudad = async (ciudad, db) => {
    const eliminada = await ciudadEliminada(ciudad, db);
    if (!eliminada) throw new Error("No existe la ciudad en el historial");
    return eliminada;
}

module.exports = { listarCiudades, obtenerDatosClima, eliminarCiudad, crearCiudad, actualizarCiudad };