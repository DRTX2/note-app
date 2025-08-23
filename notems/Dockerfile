# Etapa de construcción
FROM node:18 AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18 AS production

# Argumentos y variables de entorno para la etapa de producción
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar la build de la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto de la aplicación
EXPOSE 3000

# Healthcheck para verificar el estado de la aplicación
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

# Usuario no root para mejor seguridad
USER node

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
