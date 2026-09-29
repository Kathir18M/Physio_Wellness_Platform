# Production Deployment Guide — Physio Wellness Platform

This guide outlines the production deployment procedure for the **Physio Wellness Platform**, covering Docker containerization, Nginx reverse proxy configuration, SSL termination, environment secrets management, database migration, and health monitoring.

---

## 1. System Architecture Overview

```
Client Requests (HTTPS:443)
       │
       ▼
 ┌──────────┐
 │  Nginx   │ (SSL Termination, Rate Limiting, Security Headers)
 └────┬─────┘
      │
      ├───────────────────────┐
      │ / (Static/SSR)        │ /api/v1/* (REST APIs)
      ▼                       ▼
┌───────────┐           ┌───────────┐
│ Next.js   │           │ Gunicorn  │ (Uvicorn Async Workers)
│ Frontend  │           │ Backend   │
└───────────┘           └─────┬─────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
             ┌────────────┐      ┌────────────┐
             │ PostgreSQL │      │   Redis    │
             └────────────┘      └────────────┘
```

---

## 2. Environment Secrets Setup

1. Copy `.env.example` to `.env` in the root deployment directory:
   ```bash
   cp .env.example .env
   ```

2. Generate a secure 256-bit JWT secret:
   ```bash
   openssl rand -hex 32
   ```

3. Configure critical production values in `.env`:
   - Set `ENVIRONMENT=production` and `DEBUG=false`.
   - Update `DATABASE_URL` with a secure password.
   - Update `JWT_SECRET_KEY` with the generated secret.
   - Configure production `PAYMENT_PROVIDER` and `PAYMENT_SECRET_KEY`.
   - Configure production `AI_PROVIDER` and `AI_API_KEY`.
   - Set `NEXT_PUBLIC_API_URL` to your domain's public HTTPS API endpoint (`https://physiowellness.com/api/v1`).

---

## 3. Database Migration Process

Alembic handles automatic schema migrations. To run migrations against PostgreSQL:

```bash
# Run migrations using the backend Docker container
docker-compose -f docker-compose.prod.yml run --rm backend alembic upgrade head
```

---

## 4. Production Deployment Execution

1. Build and start all production containers in detached mode:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

2. Verify that all services pass container healthchecks:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

3. Test backend health check endpoint:
   ```bash
   curl -i https://physiowellness.com/health
   ```

---

## 5. SSL / HTTPS Certificate Renewal

SSL certificates are provisioned via Certbot and Nginx Let's Encrypt volume mounts.

To automate certificate renewal, add a cron job on the host server:
```bash
0 3 * * * certbot renew --quiet && docker-compose -f /path/to/docker-compose.prod.yml exec -T nginx nginx -s reload
```

---

## 6. Logs & Monitoring

- **Tail Backend Application Logs**:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f --tail=100 backend
  ```
- **Tail Nginx Reverse Proxy Logs**:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f --tail=100 nginx
  ```
