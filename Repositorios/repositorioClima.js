const ciudades = [
  { ciudad: "Buenos Aires", temp: 25, viento: 18 },
  { ciudad: "Córdoba", temp: 22, viento: 12 },
  { ciudad: "Rosario", temp: 28, viento: 10 },
];

const ciudadEncontrarClima = async (city) => {
  return ciudades.find((c) => c.ciudad.toLowerCase() === city.toLowerCase());
};

const ciudadEliminada = async (city) => {
  const index = ciudades.findIndex((c) => c.ciudad.toLowerCase() === city.toLowerCase());
  if (index === -1) return null;

  const eliminada = ciudades.splice(index, 1)[0];
  return eliminada;
};

module.exports = { ciudadEncontrarClima, ciudadEliminada };