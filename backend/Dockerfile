FROM python:3.12-slim

# System configuration & environment
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app \
    PORT=8000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend application code and data
COPY backend /app/backend/
COPY data /app/data/

# Ensure uploads directory exists and permissions
RUN mkdir -p /app/uploads /app/data && \
    chmod +x /app/backend/entrypoint.sh

# Security: Create non-root system user
RUN addgroup --system --gid 1001 landgov && \
    adduser --system --uid 1001 --ingroup landgov landgov && \
    chown -R landgov:landgov /app

USER landgov

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

ENTRYPOINT ["/bin/sh", "/app/backend/entrypoint.sh"]
