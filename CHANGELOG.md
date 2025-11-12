# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Agregado
- API REST completa para gestión de datos climáticos
- Soporte para SQL Server con stored procedures
- Fallback automático en memoria cuando BD no disponible
- Pool de conexiones optimizado para SQL Server
- Arquitectura en capas (Rutas → Servicios → Repositorios)
- Validaciones robustas de entrada de datos
- Manejo de errores con códigos HTTP específicos
- Mapeo automático de recordsets a objetos JavaScript
- Búsqueda case-insensitive para nombres de ciudades
- Actualización parcial de registros
- Logging detallado para debugging
- Archivo de pruebas HTTP con ejemplos completos
- Documentación completa de la API

### Características Técnicas
- **Framework:** Express.js v5.1.0
- **Base de datos:** SQL Server con driver mssql v12.1.0
- **Runtime:** Node.js v25+
- **Arquitectura:** Capas separadas con responsabilidades específicas
- **Conexiones:** Pool optimizado (max: 10, timeout: 30s)
- **Encriptación:** Habilitada con certificado confiable

### Endpoints Implementados
- `GET /api/clima/` - Listar todas las ciudades
- `GET /api/clima/:ciudad` - Obtener ciudad específica
- `POST /api/clima/` - Crear nueva ciudad
- `PUT /api/clima/:ciudad` - Actualizar ciudad existente
- `DELETE /api/clima/:ciudad` - Eliminar ciudad

### Stored Procedures
- `ciudades_TRAER_LISTA` - Obtener todas las ciudades
- `ciudades_TRAER_UNO` - Obtener ciudad por ID
- `ciudades_ALTA` - Crear nueva ciudad
- `ciudades_MODIFICACION` - Actualizar ciudad
- `ciudades_BAJA` - Eliminar ciudad

### Validaciones
- Campos requeridos en creación
- Validación de tipos de datos (números para temp/viento)
- Validación de strings no vacíos
- Verificación de duplicados
- Verificación de existencia antes de operaciones

### Manejo de Errores
- 200: Operación exitosa
- 201: Recurso creado
- 400: Datos inválidos
- 404: Recurso no encontrado
- 409: Conflicto (duplicado)
- 500: Error del servidor

### Documentación
- README.md con guía de instalación y uso
- DOCUMENTACION_API.md con especificación completa
- pruebas.http con ejemplos de todas las operaciones
- Comentarios en código para mantenibilidad

### Configuración
- .gitignore para excluir archivos innecesarios
- package.json con scripts de desarrollo y producción
- settings.json para configuración del IDE
- Configuración de pool de conexiones optimizada

---

## Formato de Versiones

- **[Major]** - Cambios incompatibles en la API
- **[Minor]** - Nueva funcionalidad compatible hacia atrás
- **[Patch]** - Correcciones de bugs compatibles

## Tipos de Cambios

- **Agregado** - Para nuevas características
- **Cambiado** - Para cambios en funcionalidad existente
- **Deprecado** - Para características que serán removidas
- **Removido** - Para características removidas
- **Corregido** - Para corrección de bugs
- **Seguridad** - Para vulnerabilidades