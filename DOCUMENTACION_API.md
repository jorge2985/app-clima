# Documentación API Clima

## Descripción General
API REST para gestionar información climática de ciudades. Permite consultar, crear, actualizar y eliminar datos de clima con soporte para base de datos SQL Server y fallback automático en memoria.

## Estructura del Proyecto
```
app-clima/
├── Controladores/          # Lógica de controladores HTTP (legacy)
├── Servicios/             # Lógica de negocio y validaciones
├── Repositorios/          # Acceso a datos (BD + memoria)
├── Rutas/                 # Definición de endpoints y validaciones
├── database/              # Configuración de base de datos
├── index_server.js        # Servidor principal con pool de conexiones
├── package.json           # Dependencias del proyecto
├── pruebas.http          # Archivo de pruebas HTTP
└── settings.json         # Configuraciones del IDE
```

## Tecnologías Utilizadas
- **Node.js** v25+ con Express.js v5.1.0
- **SQL Server** con driver mssql v12.1.0
- **Arquitectura en capas** (Rutas → Servicios → Repositorios)
- **Pool de conexiones** para optimización de BD
- **Fallback automático** en memoria cuando BD no disponible
- **Stored Procedures** para operaciones de BD

## Endpoints Disponibles

### 1. GET / (Listar todas las ciudades)
**Descripción:** Obtiene la lista completa de ciudades con sus datos climáticos

**Método:** GET  
**URL:** `/api/clima/`

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "ciudad": "Buenos Aires",
    "temp": 25,
    "viento": 18
  },
  {
    "id": 2,
    "ciudad": "Córdoba",
    "temp": 22,
    "viento": 12
  }
]
```

**Respuesta de error (500):**
```json
{
  "error": "Error al obtener la lista de ciudades"
}
```

### 2. GET /:ciudad
**Descripción:** Obtiene información climática de una ciudad específica

**Método:** GET  
**URL:** `/api/clima/:ciudad`  
**Parámetros:** 
- `ciudad` (string): Nombre de la ciudad a consultar (soporta URL encoding)

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "ciudad": "Buenos Aires",
  "temp": 25,
  "viento": 18
}
```

**Respuesta de error (404):**
```json
{
  "error": "Ciudad no encontrada"
}
```

### 3. POST /crear
**Descripción:** Crea una nueva ciudad con sus datos climáticos

**Método:** POST  
**URL:** `/api/clima/crear`  
**Body (JSON):**
```json
{
  "ciudad": "Mendoza",
  "temp": 20,
  "viento": 15
}
```

**Validaciones:**
- Campos requeridos: `ciudad`, `temp`, `viento`
- No permite ciudades duplicadas
- Validación automática en capa de servicio

**Respuesta exitosa (201):**
```json
{
  "id": 3,
  "ciudad": "Mendoza",
  "temp": 20,
  "viento": 15
}
```

**Respuestas de error:**
- **400 Bad Request:**
```json
{
  "error": "Faltan datos requeridos: ciudad, temp, viento"
}
```
- **409 Conflict:**
```json
{
  "error": "La ciudad ya existe"
}
```

### 4. PUT /actualizar/:ciudad
**Descripción:** Actualiza los datos climáticos de una ciudad existente

**Método:** PUT  
**URL:** `/api/clima/actualizar/:ciudad`  
**Parámetros:**
- `ciudad` (string): Nombre de la ciudad a actualizar (soporta URL encoding)

**Body (JSON) - Actualización parcial permitida:**
```json
{
  "temp": 30,
  "viento": 20,
  "ciudad": "Nuevo Nombre" // opcional
}
```

**Validaciones implementadas:**
- `temp`: Debe ser un número válido
- `viento`: Debe ser un número válido
- `ciudad`: Debe ser un string no vacío
- Solo valida campos presentes en el body

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "ciudad": "Buenos Aires",
  "temp": 30,
  "viento": 20
}
```

**Respuestas de error:**
- **400 Bad Request:**
```json
{
  "error": "Temperatura debe ser un número válido"
}
```
- **404 Not Found:**
```json
{
  "error": "Ciudad no encontrada para actualizar"
}
```

### 5. DELETE /eliminar/:ciudad
**Descripción:** Elimina una ciudad del historial climático

**Método:** DELETE  
**URL:** `/api/clima/eliminar/:ciudad`  
**Parámetros:**
- `ciudad` (string): Nombre de la ciudad a eliminar (soporta URL encoding)

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "ciudad": "Buenos Aires",
  "temp": 25,
  "viento": 18
}
```

**Respuesta de error (404):**
```json
{
  "error": "No existe la ciudad en el historial"
}
```

## Arquitectura de Capas

### Rutas (rutasClima.js)
- **Responsabilidad:** Definir endpoints HTTP y manejar peticiones
- **Características:**
  - Middleware de logging para debug
  - Manejo de errores HTTP específicos
  - Validación de tipos de datos en PUT
  - Decodificación URL para parámetros
- **Endpoints:** GET /, GET /:city, POST /crear, PUT /actualizar/:city, DELETE /eliminar/:city

### Servicios (servicioClima.js)
- **Responsabilidad:** Lógica de negocio y validaciones
- **Funciones:**
  - `listarCiudades(db)`: Obtener lista completa
  - `obtenerDatosClima(ciudad, db)`: Obtener datos de ciudad específica
  - `crearCiudad(datosClima, db)`: Crear nueva ciudad con validaciones
  - `actualizarCiudad(ciudad, datos, db)`: Actualizar ciudad existente
  - `eliminarCiudad(ciudad, db)`: Eliminar ciudad del sistema

### Repositorios (repositorioClima.js)
- **Responsabilidad:** Acceso a datos con soporte dual BD/memoria
- **Características:**
  - **Mapeo de datos:** Helper `mapRowToCiudad()` para transformar recordsets
  - **Stored procedures:** `ciudades_TRAER_LISTA`, `ciudades_TRAER_UNO`, `ciudades_ALTA`, `ciudades_BAJA`, `ciudades_MODIFICACION`
  - **Fallback inteligente:** Array en memoria cuando BD no disponible
  - **Búsqueda insensible:** Case-insensitive para nombres de ciudades
  - **Actualización parcial:** Solo modifica campos proporcionados
  - **Validación de existencia:** Verificación antes de operaciones
- **Funciones:**
  - `ciudadTraerLista(db)`: Lista completa con mapeo automático
  - `ciudadEncontrarClima(city, db)`: Búsqueda por nombre (case-insensitive)
  - `ciudadCreada(nuevaCiudad, db)`: Inserción con validación de duplicados
  - `ciudadActualizada(city, datos, db)`: Actualización parcial inteligente
  - `ciudadEliminada(city, db)`: Eliminación con retorno de datos

### Servidor Principal (index_server.js)
- **Responsabilidad:** Configuración y arranque del servidor
- **Características:**
  - Conexión a SQL Server con pool de conexiones
  - Configuración de middleware Express
  - Manejo de errores de conexión BD
  - Servidor no bloqueante (inicia sin esperar BD)

## Base de Datos

### Configuración SQL Server
- **Servidor:** dbAppClima.mssql.somee.com
- **Base de datos:** dbAppClima
- **Driver:** mssql v12.1.0
- **Pool de conexiones:** Máx 10, Mín 0
- **Encriptación:** Habilitada con certificado confiable

### Stored Procedures Utilizados
- `ciudades_TRAER_LISTA`: Obtener todas las ciudades con mapeo automático
- `ciudades_TRAER_UNO`: Obtener ciudad específica por ID (usado en actualizaciones)
- `ciudades_ALTA`: Crear nueva ciudad con retorno de SCOPE_IDENTITY()
- `ciudades_MODIFICACION`: Actualizar ciudad existente por ID
- `ciudades_BAJA`: Eliminar ciudad por ID con validación

### Mapeo de Datos
La capa de repositorio incluye mapeo automático de recordsets:
```javascript
const mapRowToCiudad = (row) => ({
  id: row.ciudad_id,
  ciudad: row.ciudad_nombre,
  temp: Number(row.ciudad_temperatura),
  viento: row.ciudad_viento
});
```

## Validaciones Implementadas

### CREATE (POST)
- **Campos requeridos:** `ciudad`, `temp`, `viento`
- **Validación de duplicados:** No permite ciudades existentes
- **Validación en servicio:** Tipos de datos y campos obligatorios

### UPDATE (PUT)
- **Validación de tipos:** `temp` y `viento` deben ser números válidos
- **Validación de string:** `ciudad` debe ser string no vacío
- **Actualización parcial:** Solo valida campos presentes
- **Existencia:** Verifica que la ciudad exista antes de actualizar

### DELETE
- **Verificación de existencia:** Antes de eliminar
- **Retorno de datos:** Devuelve la ciudad eliminada

### GET
- **Búsqueda insensible:** Mayúsculas/minúsculas
- **URL decoding:** Soporte para caracteres especiales
- **Manejo de errores:** Ciudades no encontradas

## Códigos de Estado HTTP

- **200 OK:** Operación exitosa (GET, PUT, DELETE)
- **201 Created:** Recurso creado exitosamente (POST)
- **400 Bad Request:** Datos inválidos o ciudad duplicada
- **404 Not Found:** Ciudad no encontrada
- **500 Internal Server Error:** Error del servidor

## Instalación y Ejecución

### Requisitos
- Node.js (v14 o superior)
- Acceso a internet (para conexión a BD remota)

### Instalación
```bash
npm install
```

### Ejecución
```bash
node index_server.js
```

### Dependencias
- **express:** ^5.1.0 - Framework web
- **mssql:** ^12.1.0 - Driver SQL Server con pool de conexiones
- **node:** ^25.1.0 - Runtime de Node.js
- **dotenv:** ^17.2.3

### Dependencias de Desarrollo
- **nodemon:** ^3.1.11 - Auto-reload durante desarrollo

## Ejemplos de Uso

### Listar todas las ciudades
```bash
curl http://localhost:3000/api/clima/
```

### Consultar ciudad específica
```bash
curl http://localhost:3000/api/clima/Buenos%20Aires
```

### Crear nueva ciudad
```bash
curl -X POST http://localhost:3000/api/clima/crear \
  -H "Content-Type: application/json" \
  -d '{"ciudad":"Salta","temp":18,"viento":12}'
```

### Actualizar ciudad (parcial)
```bash
curl -X PUT http://localhost:3000/api/clima/actualizar/Salta \
  -H "Content-Type: application/json" \
  -d '{"temp":22}'
```

### Eliminar ciudad
```bash
curl -X DELETE http://localhost:3000/api/clima/eliminar/Salta
```

## Características Avanzadas

### Pool de Conexiones
```javascript
const dbConfig = {
  pool: {
    max: 10,           // Máximo 10 conexiones
    min: 0,            // Mínimo 0 conexiones
    idleTimeoutMillis: 30000  // Timeout de inactividad
  },
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};
```

### Manejo de Errores Mejorado
- **Validación de tipos:** Números válidos para temp/viento
- **Validación de strings:** No vacíos para nombres de ciudades
- **Códigos HTTP específicos:** 400, 404, 409, 500 según el error
- **Mensajes descriptivos:** Errores claros para debugging

### Logging y Debug
- **Rutas:** `[RUTAS-CLIMA] GET /api/clima/`
- **Conexión BD:** Estado de pool al iniciar servidor
- **Errores:** Stack traces completos en consola
- **Fallback:** Notificación cuando usa memoria

### Optimizaciones de Rendimiento
- **Servidor no bloqueante:** Inicia sin esperar conexión BD
- **Pool de conexiones:** Reutilización eficiente de conexiones
- **Mapeo optimizado:** Transformación directa de recordsets
- **Búsqueda eficiente:** Case-insensitive con toLowerCase()

## Archivo de Pruebas HTTP

El proyecto incluye `pruebas.http` con ejemplos completos:
```http
### Lista todas las ciudades
GET http://localhost:3000/api/clima

### Obtener clima de una ciudad
GET http://localhost:3000/api/clima/Mar%20del%20Plata

### Crear nueva ciudad
POST http://localhost:3000/api/clima/crear
Content-Type: application/json

{
  "ciudad": "San Francisco",
  "temp": 20,
  "viento": 45
}

### Actualizar ciudad
PUT http://localhost:3000/api/clima/actualizar/Avellaneda
Content-Type: application/json

{
  "temp": 25,
  "viento": 10
}

### Eliminar ciudad
DELETE http://localhost:3000/api/clima/eliminar/Mar%20del%20Plata
```
