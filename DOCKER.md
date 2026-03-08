# Docker

## Quick start

1. Copy env and set values:
   ```bash
   cp .env.example .env
   # Edit .env with your Discord app credentials and JWT_SECRET
   ```

2. Build and start:
   ```bash
   docker compose up -d --build
   ```

3. Open:
   - Web: http://localhost:3000
   - API: http://localhost:3001

## Database

- Postgres runs in the `postgres` service (port 5432). Data is in the `postgres_data` volume.
- Apply schema (first time or after schema changes):
  ```bash
  docker compose run --rm api npx prisma db push --schema=packages/database/prisma/schema.prisma
  ```
  Or from the host with the same `DATABASE_URL`: `npm run db:push`.

## Services

| Service   | Port | Description        |
|----------|------|--------------------|
| web      | 3000 | Next.js dashboard  |
| api      | 3001 | Express API + WS   |
| bot      | -    | Discord bot        |
| postgres | 5432 | PostgreSQL 16      |

## Env vars (see .env.example)

- **DISCORD_***: From [Discord Developer Portal](https://discord.com/developers/applications).
- **JWT_SECRET**: Long random string for auth tokens.
- **NEXT_PUBLIC_***: Must match how you reach the app (e.g. `http://localhost:3001` when using Docker and opening the site on localhost). Rebuild the web image after changing these.

## Commands

```bash
docker compose up -d --build   # Build and start
docker compose logs -f         # Follow logs
docker compose down            # Stop and remove containers
docker compose down -v         # Also remove volumes (database data)
```

## Port already in use

If you see `ports are not available... 3001` (or 3000), something on the host is using that port—often a local `npm run dev`. Either:

1. **Stop local dev** (Ctrl+C in the terminal running `npm run dev`), then run `docker compose up -d` again, or  
2. **Use different host ports**: in `docker-compose.yml`, change the API and web port mappings, e.g. `"13001:3001"` and `"13000:3000"`. Then use http://localhost:13000 for the app and set `FRONTEND_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`, and `DISCORD_REDIRECT_URI` to the 13000/13001 URLs when running with Docker.
