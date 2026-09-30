# ----------------------------------------------------
# Stage 1: Build Frontend Assets
# ----------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies (clean install)
RUN npm ci --prefer-offline --no-audit

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# ----------------------------------------------------
# Stage 2: Production Nginx Server
# ----------------------------------------------------
FROM nginx:1.27-alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
