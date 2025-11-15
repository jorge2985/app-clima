// Helper: map recordset row -> objeto ciudad
const mapRowToCiudad = (row) => ({
  id: row.ciudad_id,
  ciudad: row.ciudad_nombre,
  temp: Number(row.ciudad_temperatura),
  viento: row.ciudad_viento,
});

// Helper: obtener lista desde BD usando SP ciudades_TRAER_LISTA
const traerListaDesdeDB = async (db) => {
  try {
    const result = await db.request().execute('ciudades_TRAER_LISTA');
    const rows = result.recordset || [];
    return rows.map(mapRowToCiudad);
  } catch (error) {
    throw new Error(`Error al obtener lista desde BD: ${error.message}`);
  }
};

// Public: traer lista (usa BD si se pasa, si no fallback memoria)
const ciudadTraerLista = async (db) => {
  try {
    if (db) return await traerListaDesdeDB(db);
  } catch (error) {
    throw new Error('Error interno del servidor');
  }
};

// Busca la ciudad por nombre
const ciudadEncontrarClima = async (city, db) => {
  try {
    if (db) {
      const lista = await traerListaDesdeDB(db);
      return lista.find((c) => c.ciudad.toLowerCase() === city.toLowerCase()) || null;
    }
  } catch (error) {
    throw new Error('Error interno del servidor');
  }
};

// Crear nueva ciudad
const ciudadCreada = async (nuevaCiudad, db) => {
  try {
    if (db) {
      const { ciudad: nombre, temp, viento } = nuevaCiudad;
      const result = await db.request()
        .input('ciudad_nombre', nombre)
        .input('ciudad_temperatura', temp)
        .input('ciudad_viento', viento)
        .execute('ciudades_ALTA');

      // Verificar si se insertó correctamente
      const newId = result.recordset[0]?.ciudad_id;

      if (!newId) {
        throw new Error('Error en la Creación de la ciudad: ' + nombre); // ya existe o error
      }

      // SP selecciona SCOPE_IDENTITY() AS ciudad_id
      const id = result.recordset && result.recordset[0] ? result.recordset[0].ciudad_id : null;
      return { id, ciudad: nombre, temp: Number(temp), viento };
    }
  } catch (error) {
    throw new Error('Error interno del servidor');
  }
};

// UPDATE - Actualizar datos de ciudad existente (busca por nombre si se pasa nombre)
const ciudadActualizada = async (city, datosActualizados, db) => {
  try {
    if (db) {
      // localizar id por nombre
      const lista = await traerListaDesdeDB(db);
      const found = lista.find((c) => c.ciudad.toLowerCase() === city.toLowerCase());
      if (!found) return null;

      // preparar valores: si no vienen en datosActualizados, usar los existentes
      const nuevoNombre = datosActualizados.ciudad ?? found.ciudad;
      const nuevaTemp = datosActualizados.temp ?? found.temp;
      const nuevoViento = datosActualizados.viento ?? found.viento;

      // ejecutar SP de modificación
      await db.request()
        .input('ciudad_id', found.id)
        .input('ciudad_nombre', nuevoNombre)
        .input('ciudad_temperatura', nuevaTemp)
        .input('ciudad_viento', nuevoViento)
        .execute('ciudades_MODIFICACION');

      // traer registro actualizado mediante SP ciudades_TRAER_UNO
      const res = await db.request()
        .input('ciudad_id', found.id)
        .execute('ciudades_TRAER_UNO');

      const row = res.recordset && res.recordset[0];
      return row ? mapRowToCiudad(row) : { id: found.id, ciudad: nuevoNombre, temp: Number(nuevaTemp), viento: nuevoViento };
    }
  } catch (error) {
    throw new Error('Error interno del servidor');
  }
};

// Borrar ciudad por nombre
const ciudadEliminada = async (city, db) => {
  try {
    if (db) {
      const lista = await traerListaDesdeDB(db);
      const found = lista.find((c) => c.ciudad.toLowerCase() === city.toLowerCase());
      if (!found) return null;

      await db.request()
        .input('ciudad_id', found.id)
        .execute('ciudades_BAJA');

      return found; // devolver objeto eliminado
    }
  } catch (error) {
    throw new Error('Error interno del servidor');
  }
};

module.exports = { ciudadTraerLista, ciudadEncontrarClima, ciudadEliminada, ciudadCreada, ciudadActualizada };