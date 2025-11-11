const ciudades = [
  { ciudad: "Buenos Aires", temp: 25, viento: 18 },
  { ciudad: "Córdoba", temp: 22, viento: 12 },
  { ciudad: "Rosario", temp: 28, viento: 10 },
];

// Helper: map recordset row -> objeto ciudad
const mapRowToCiudad = (row) => ({
  id: row.ciudad_id,
  ciudad: row.ciudad_nombre,
  temp: Number(row.ciudad_temperatura),
  viento: row.ciudad_viento,
});

// Helper: obtener lista desde BD usando SP ciudades_TRAER_LISTA
const traerListaDesdeDB = async (db) => {
  const result = await db.request().execute('ciudades_TRAER_LISTA');
  const rows = result.recordset || [];
  return rows.map(mapRowToCiudad);
};

// Public: traer lista (usa BD si se pasa, si no fallback memoria)
const ciudadTraerLista = async (db) => {
  if (db) return await traerListaDesdeDB(db);
  // map al formato con id undefined para compatibilidad
  return ciudades.map((c, idx) => ({ id: undefined, ciudad: c.ciudad, temp: c.temp, viento: c.viento }));
};

// FIND by city name
const ciudadEncontrarClima = async (city, db) => {
  if (db) {
    const lista = await traerListaDesdeDB(db);
    return lista.find((c) => c.ciudad.toLowerCase() === city.toLowerCase()) || null;
  }

  // fallback memoria
  return ciudades.find((c) => c.ciudad.toLowerCase() === city.toLowerCase()) || null;
};

// DELETE by city name
const ciudadEliminada = async (city, db) => {
  if (db) {
    const lista = await traerListaDesdeDB(db);
    const found = lista.find((c) => c.ciudad.toLowerCase() === city.toLowerCase());
    if (!found) return null;

    await db.request()
      .input('ciudad_id', found.id)
      .execute('ciudades_BAJA');

    return found; // devolver objeto eliminado
  }

  // fallback memoria
  const index = ciudades.findIndex((c) => c.ciudad.toLowerCase() === city.toLowerCase());
  if (index === -1) return null;

  const eliminada = ciudades.splice(index, 1)[0];
  return eliminada;
};

// CREATE - Crear nueva ciudad
const ciudadCreada = async (nuevaCiudad, db) => {
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

  // fallback memoria
  const existe = ciudades.find((c) => c.ciudad.toLowerCase() === nuevaCiudad.ciudad.toLowerCase());
  if (existe) return null;

  ciudades.push(nuevaCiudad);
  return nuevaCiudad;
};

// UPDATE - Actualizar datos de ciudad existente (busca por nombre si se pasa nombre)
const ciudadActualizada = async (city, datosActualizados, db) => {
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
    const result = await db.request()
      .input('ciudad_id', found.id)
      .input('ciudad_nombre', nuevoNombre)
      .input('ciudad_temperatura', nuevaTemp)
      .input('ciudad_viento', nuevoViento)
      .execute('ciudades_MODIFICACION');

    // validar que se modificó alguna una fila

    if (result.rowsAffected[0] == 0) {
      throw new Error('Error en la modificación: no se encontraron registros para actualizar');
    }

    // traer registro actualizado mediante SP ciudades_TRAER_UNO
    const res = await db.request()
      .input('ciudad_id', found.id)
      .execute('ciudades_TRAER_UNO');



    const row = res.recordset && res.recordset[0];
    return row ? mapRowToCiudad(row) : { id: found.id, ciudad: nuevoNombre, temp: Number(nuevaTemp), viento: nuevoViento };
  }



  // fallback memoria
  const index = ciudades.findIndex((c) => c.ciudad.toLowerCase() === city.toLowerCase());
  if (index === -1) return null;

  ciudades[index] = { ...ciudades[index], ...datosActualizados };
  return ciudades[index];
};

module.exports = { ciudadTraerLista, ciudadEncontrarClima, ciudadEliminada, ciudadCreada, ciudadActualizada };