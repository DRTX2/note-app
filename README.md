# Note App - Aplicación de Microservicios

Una aplicación de notas basada en arquitectura de microservicios utilizando NestJS, PostgreSQL y RabbitMQ.

## Arquitectura

La aplicación está compuesta por tres microservicios principales:

- **AuthMS**: Gestiona la autenticación y generación de tokens JWT
- **NoteMS**: Maneja las operaciones CRUD de notas, categorías y etiquetas
- **UserMS**: Administra los usuarios y su información

## Configuración y Ejecución

Para ejecutar la aplicación, utiliza Docker Compose:

```bash
docker-compose up -d
```

La aplicación estará disponible en http://localhost:8080

## Endpoints Disponibles

### Microservicio de Autenticación (AuthMS)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Inicia sesión con credenciales de usuario |
| GET | `/auth/status` | Verifica el estado de autenticación actual (requiere JWT) |
| GET | `/auth/api/health` | Endpoint de verificación de salud del servicio |

### Microservicio de Notas (NoteMS)

#### Notas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/notes` | Recupera todas las notas (soporta filtros) |
| GET | `/notes/:id` | Recupera una nota por ID |
| POST | `/notes` | Crea una nueva nota |
| PUT | `/notes/:id` | Actualiza una nota existente |
| DELETE | `/notes/:id` | Elimina una nota |
| PATCH | `/notes/:id/restore` | Restaura una nota eliminada |

#### Categorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/categories` | Recupera todas las categorías |
| GET | `/categories/:id` | Recupera una categoría por ID |
| POST | `/categories` | Crea una nueva categoría |
| PUT | `/categories/:id` | Actualiza una categoría existente |
| DELETE | `/categories/:id` | Elimina una categoría |

#### Etiquetas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tags` | Recupera todas las etiquetas |
| GET | `/tags/:id` | Recupera una etiqueta por ID |
| POST | `/tags` | Crea una nueva etiqueta |
| POST | `/tags/multiple` | Crea múltiples etiquetas a la vez |
| PUT | `/tags/:id` | Actualiza una etiqueta existente |
| DELETE | `/tags/:id` | Elimina una etiqueta |

#### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/notes/api/health` | Endpoint de verificación de salud del servicio |

### Microservicio de Usuarios (UserMS)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/users` | Registra un nuevo usuario |
| POST | `/users/login` | Inicia sesión (usado internamente) |
| GET | `/users/:id` | Recupera información de un usuario por ID |
| PUT | `/users/:id` | Actualiza información de un usuario |
| DELETE | `/users/:id` | Elimina un usuario |
| GET | `/users/api/health` | Endpoint de verificación de salud del servicio |

## Documentación API

La documentación completa de la API está disponible en:

- Swagger UI: http://localhost:3002/api (NoteMS)

## Flujo de Autenticación

1. Registrar un usuario enviando una solicitud POST a `/users`
2. Iniciar sesión con POST a `/auth/login` para recibir un token JWT
3. Incluir el token en las solicitudes como encabezado `Authorization: Bearer {token}`

## Variables de Entorno

Las variables de entorno están configuradas en el archivo `docker-compose.yml` pero pueden ser modificadas según sea necesario:

- `NODE_ENV`: Entorno de ejecución ('development' o 'production')
- `RABBITMQ_URL`: URL de conexión a RabbitMQ
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`: Configuración de la base de datos
- `JWT_SECRET`: Clave secreta para firmar tokens JWT
- `ALLOWED_ORIGINS`: Orígenes permitidos para CORS

## Solución de Problemas

Si encuentra problemas al ejecutar la aplicación:

1. Asegúrese de que los puertos 8080, 5432 y 5672 estén disponibles
2. Verifique los logs de Docker: `docker-compose logs -f`
3. Compruebe el estado de los servicios: `docker-compose ps`
4. Verifique los health checks de los servicios en los siguientes endpoints:
   - AuthMS: `http://localhost:8080/auth/api/health`
   - NoteMS: `http://localhost:8080/notes/api/health`
   - UserMS: `http://localhost:8080/users/api/health`

## Configuración NGINX

La aplicación utiliza NGINX como puerta de enlace (API Gateway) para dirigir las solicitudes a los microservicios correspondientes. La configuración de NGINX se encuentra en el archivo `nginx.conf` y contiene las siguientes reglas importantes:

```nginx
# Configuración para el microservicio de autenticación
location /auth {
    proxy_pass http://authms;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    # Otros headers...
}

location /auth/api/health {
    proxy_pass http://authms/api/health;
    # Headers...
}

# Configuración para el microservicio de notas
location /notes {
    proxy_pass http://notems;
    # Headers...
}

location /notes/api/health {
    proxy_pass http://notems/api/health;
    # Headers...
}

# Configuración para el microservicio de usuarios
location /users {
    proxy_pass http://userms;
    # Headers...
}

location /users/api/health {
    proxy_pass http://userms/api/health;
    # Headers...
}
```

**Nota importante:** Los controladores en NestJS ya incluyen sus propios prefijos (por ejemplo, `@Controller('users')`). Por esta razón, la configuración de NGINX debe tener en cuenta estos prefijos para evitar duplicaciones en las rutas. Las rutas específicas para health checks son necesarias para garantizar que estos endpoints sean accesibles correctamente.
