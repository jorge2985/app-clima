# Documentación API Clima

## Descripción General
API REST para gestionar información climática de ciudades. Permite consultar, crear, actualizar y eliminar datos de clima.

## Estructura del Proyecto
```
app-clima/
├── Controladores/          # Lógica de controladores HTTP
├── Servicios/             # Lógica de negocio
├── Repositorios/          # Acceso a datos
├── Rutas/                 # Definición de endpoints
└── database/              # Configuración de base de datos
```

## Endpoints Disponibles

### 1. GET /:ciudad
**Descripción:** Obtiene información climática de una ciudad específica

**Método:** GET  
**URL:** `/api/clima/:ciudad`  
**Parámetros:** 
- `ciudad` (string): Nombre de la ciudad a consultar

**Respuesta exitosa (200):**
```json
{
  "ciudad": "Buenos Aires",
  "temp": 25,
  "viento": 18
}
```

**Respuesta de error (500):**
```json
{
  "error": "Ciudad no encontrada"
}
```

### 2. POST /
**Descripción:** Crea una nueva ciudad con sus datos climáticos

**Método:** POST  
**URL:** `/api/clima/`  
**Body (JSON):**
```json
{
  "ciudad": "Mendoza",
  "temp": 20,
  "viento": 15
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Mendoza agregada exitosamente",
  "data": {
    "ciudad": "Mendoza",
    "temp": 20,
    "viento": 15
  }
}
```

**Respuesta de error (400):**
```json
{
  "error": "La ciudad ya existe"
}
```

### 3. PUT /:ciudad
**Descripción:** Actualiza los datos climáticos de una ciudad existente

**Método:** PUT  
**URL:** `/api/clima/:ciudad`  
**Parámetros:**
- `ciudad` (string): Nombre de la ciudad a actualizar

**Body (JSON):**
```json
{
  "temp": 30,
  "viento": 20
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Buenos Aires actualizada exitosamente",
  "data": {
    "ciudad": "Buenos Aires",
    "temp": 30,
    "viento": 20
  }
}
```

**Respuesta de error (404):**
```json
{
  "error": "Ciudad no encontrada para actualizar"
}
```

### 4. DELETE /:ciudad
**Descripción:** Elimina una ciudad del historial climático

**Método:** DELETE  
**URL:** `/api/clima/:ciudad`  
**Parámetros:**
- `ciudad` (string): Nombre de la ciudad a eliminar

**Respuesta exitosa (200):**
```json
{
  "message": "Buenos Aires eliminada del historial"
}
```

**Respuesta de error (404):**
```json
{
  "error": "No existe la ciudad en el historial"
}
```

## Arquitectura de Capas

### Controladores (controladorClima.js)
- **Responsabilidad:** Manejar peticiones HTTP y respuestas
- **Funciones:**
  - `obtenerClima()`: Controlador GET
  - `crearClima()`: Controlador POST
  - `actualizarClima()`: Controlador PUT
  - `eliminarClima()`: Controlador DELETE

### Servicios (servicioClima.js)
- **Responsabilidad:** Lógica de negocio y validaciones
- **Funciones:**
  - `obtenerDatosClima()`: Obtener datos de ciudad
  - `crearCiudad()`: Crear nueva ciudad con validaciones
  - `actualizarCiudad()`: Actualizar ciudad existente
  - `eliminarCiudad()`: Eliminar ciudad del sistema

### Repositorios (repositorioClima.js)
- **Responsabilidad:** Acceso directo a datos
- **Funciones:**
  - `ciudadEncontrarClima()`: Buscar ciudad en datos
  - `ciudadCreada()`: Insertar nueva ciudad
  - `ciudadActualizada()`: Modificar datos de ciudad
  - `ciudadEliminada()`: Remover ciudad de datos

### Rutas (rutasClima.js)
- **Responsabilidad:** Definir endpoints y vincular controladores
- **Configuración:** Mapeo de URLs a funciones controladoras

## Validaciones Implementadas

### CREATE (POST)
- Campos requeridos: `ciudad`, `temp`, `viento`
- No permite ciudades duplicadas
- Validación de tipos de datos

### UPDATE (PUT)
- Ciudad debe existir previamente
- Actualización parcial permitida
- Mantiene datos no modificados

### DELETE
- Verifica existencia antes de eliminar
- Retorna datos de ciudad eliminada

### GET
- Búsqueda insensible a mayúsculas/minúsculas
- Manejo de ciudades no encontradas

## Códigos de Estado HTTP

- **200 OK:** Operación exitosa (GET, PUT, DELETE)
- **201 Created:** Recurso creado exitosamente (POST)
- **400 Bad Request:** Datos inválidos o ciudad duplicada
- **404 Not Found:** Ciudad no encontrada
- **500 Internal Server Error:** Error del servidor

## Ejemplos de Uso

### Crear nueva ciudad
```bash
curl -X POST http://localhost:3000/api/clima \
  -H "Content-Type: application/json" \
  -d '{"ciudad":"Salta","temp":18,"viento":12}'
```

### Actualizar ciudad existente
```bash
curl -X PUT http://localhost:3000/api/clima/Salta \
  -H "Content-Type: application/json" \
  -d '{"temp":22}'
```

### Consultar ciudad
```bash
curl http://localhost:3000/api/clima/Salta
```

### Eliminar ciudad
```bash
curl -X DELETE http://localhost:3000/api/clima/Salta
```