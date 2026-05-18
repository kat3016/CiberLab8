# CiberLab8 Backend

Backend en NestJS para un laboratorio academico de concientizacion sobre phishing. La API registra interacciones pedagogicas de una pagina simulada y expone contenido educativo despues del envio.

> Uso educativo solamente. Este proyecto debe ejecutarse en contextos controlados, autorizados y con consentimiento de los participantes.

## Que hace

- Expone una API bajo el prefijo `/api`.
- Registra eventos de interaccion del frontend: `click` y `submit`.
- Guarda evidencia minima para el laboratorio: correo, tipo de interaccion, fecha, IP y User-Agent.
- No recibe ni almacena contrasenas, tokens, cookies ni sesiones.
- Rechaza campos extra como `password` mediante validacion global.
- Ofrece documentacion visual en Swagger UI.

## Requisitos

- Node.js 18 o superior recomendado.
- npm.

## Instalacion

Desde la carpeta del backend:

```bash
npm install
```

## Variables de entorno

El backend usa `.env`. Ejemplo:

```env
PORT=3000
NODE_ENV=development
LOG_DIR=src/logs
INTERACTIONS_LOG_FILE=src/logs/interactions.json
CORS_ORIGIN=http://localhost:4200
AWARENESS_REDIRECT_URL=/awareness
LAB_NAME=Phishing Awareness Simulation Lab
LAB_VERSION=1.0.0
```

Campos importantes:

- `PORT`: puerto donde corre la API.
- `CORS_ORIGIN`: origen autorizado para consumir la API desde el navegador. Si el frontend esta en otro dominio, debe cambiarse.
- `INTERACTIONS_LOG_FILE`: archivo JSON donde se guardan las interacciones.
- `AWARENESS_REDIRECT_URL`: ruta que se devuelve al frontend despues de registrar una interaccion.

## Ejecutar en desarrollo

```bash
npm run start:dev
```

La API queda disponible en:

```text
http://localhost:3000/api
```

La documentacion Swagger queda en:

```text
http://localhost:3000/api/docs
```

## Ejecutar en produccion local

Compilar:

```bash
npm run build
```

Ejecutar la version compilada:

```bash
npm run start:prod
```

## Scripts disponibles

```bash
npm run start       # Inicia Nest
npm run start:dev   # Inicia con watch mode
npm run build       # Compila TypeScript a dist/
npm run start:prod  # Ejecuta dist/main.js
npm run format      # Formatea archivos TypeScript
npm run lint        # Ejecuta ESLint con fix
npm run test        # Ejecuta pruebas si existen
```

## Endpoints principales

### GET `/api`

Health check de la API.

Respuesta ejemplo:

```json
{
  "status": "ok",
  "name": "Phishing Awareness Simulation Lab API",
  "version": "1.0.0",
  "message": "API running",
  "docs": "/api/docs",
  "timestamp": "2026-05-18T00:00:00.000Z"
}
```

### GET `/api/docs`

Interfaz visual de Swagger con la documentacion de los endpoints.

### GET `/api/awareness`

Devuelve contenido educativo para mostrar despues de la simulacion.

### POST `/api/interactions`

Registra una interaccion del frontend.

Body permitido:

```json
{
  "email": "estudiante@uniandes.edu.co",
  "interactionType": "submit"
}
```

`interactionType` solo puede ser:

- `click`
- `submit`

Respuesta ejemplo:

```json
{
  "message": "Interaction registered successfully",
  "redirectUrl": "/awareness"
}
```

Importante: si el cliente envia `password` u otro campo no permitido, la API responde error `400`.

### GET `/api/interactions/stats`

Devuelve conteos agregados.

Respuesta ejemplo:

```json
{
  "totalInteractions": 10,
  "totalSubmits": 5,
  "totalClicks": 5
}
```

### GET `/api/interactions/logs`

Devuelve todos los registros almacenados.

Respuesta ejemplo:

```json
[
  {
    "email": "estudiante@uniandes.edu.co",
    "interactionType": "submit",
    "timestamp": "2026-05-18T00:00:00.000Z",
    "ip": "127.0.0.1",
    "userAgent": "Mozilla/5.0"
  }
]
```

Este endpoint expone metadatos personales. No deberia quedar publico sin autenticacion o restriccion de acceso.

## Datos que se guardan

Por cada interaccion se guarda:

- `email`
- `interactionType`
- `timestamp`
- `ip`
- `userAgent`

No se guarda:

- contrasena
- tokens
- cookies
- datos de sesion
- credenciales reales

La validacion global esta configurada en `src/main.ts` con:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Esto hace que el DTO `CreateInteractionDto` acepte solo `email` e `interactionType`, y rechace campos extra.

## Donde se almacenan los registros

Por defecto:

```text
src/logs/interactions.json
```

Ese archivo esta ignorado por Git en `.gitignore` porque puede contener metadatos personales.

## Conexion con el frontend

El frontend debe llamar:

```text
POST http://localhost:3000/api/interactions
```

Ejemplo desde JavaScript:

```js
await fetch('http://localhost:3000/api/interactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'estudiante@uniandes.edu.co',
    interactionType: 'submit',
  }),
});
```

No incluir contrasena en el JSON, aunque exista un campo visual de contrasena en el formulario.

## Estructura del proyecto

```text
src/
  app.controller.ts
  app.module.ts
  main.ts
  awareness/
    awareness.controller.ts
    awareness.module.ts
  interactions/
    dto/
      create-interaction.dto.ts
    interfaces/
      interaction.interface.ts
    interactions.controller.ts
    interactions.module.ts
    interactions.service.ts
  common/
    filters/
      http-exception.filter.ts
    interceptors/
      logging.interceptor.ts
```

Archivos clave:

- `src/main.ts`: configuracion global, CORS, validacion y Swagger.
- `src/app.controller.ts`: health check de `/api`.
- `src/awareness/awareness.controller.ts`: contenido educativo.
- `src/interactions/interactions.controller.ts`: endpoints de interacciones.
- `src/interactions/interactions.service.ts`: lectura/escritura del log JSON.
- `src/interactions/dto/create-interaction.dto.ts`: validacion del body permitido.

## Probar rapido con curl

Health check:

```bash
curl http://localhost:3000/api
```

Registrar click:

```bash
curl -X POST http://localhost:3000/api/interactions \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"estudiante@uniandes.edu.co\",\"interactionType\":\"click\"}"
```

Ver estadisticas:

```bash
curl http://localhost:3000/api/interactions/stats
```

Ver logs:

```bash
curl http://localhost:3000/api/interactions/logs
```

## Notas para despliegue

Si se despliega en Vercel u otra plataforma serverless:

- El filesystem puede ser efimero o de solo lectura, por lo que `src/logs/interactions.json` no es una solucion robusta para produccion.
- Para persistencia real conviene usar una base de datos o almacenamiento externo.
- Configurar `CORS_ORIGIN` con el dominio real del frontend.
- Proteger `/api/interactions/logs` antes de exponerlo publicamente.
- Evitar `console.log(req.body)` o cualquier log que incluya datos enviados por usuarios.
- No subir `.env` ni archivos de logs.

## Seguridad y privacidad

Recomendaciones minimas antes de publicarlo:

- Mantener visible el aviso de que es una prueba academica.
- Tener autorizacion del curso, laboratorio o institucion.
- No pedir credenciales reales.
- No enviar contrasenas al backend.
- Limitar acceso al dashboard/logs.
- Eliminar registros cuando ya no sean necesarios.

## Swagger

Swagger se configura en `src/main.ts` con `@nestjs/swagger`.

Ruta:

```text
http://localhost:3000/api/docs
```

Tambien se genera el spec JSON en:

```text
http://localhost:3000/api/docs-json
```
