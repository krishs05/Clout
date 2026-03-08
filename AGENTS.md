# Clout - AI Agent Development Guide

## Project Overview

Clout is a full-stack Discord bot application with a premium web dashboard. It features a karma/economy system (good/bad deeds tracking), mini-games, server management, and real-time dashboard controls.

The project uses a monorepo structure managed by npm workspaces and Turbo, with three main applications (web frontend, API backend, Discord bot) and two shared packages (database, shared utilities).

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript 5.8, Tailwind CSS 4.1, Three.js, GSAP |
| **Backend** | Node.js 20, Express 4, TypeScript, WebSocket (ws) |
| **Database** | PostgreSQL 16, Prisma ORM 5.7 |
| **Bot** | Discord.js v14 |
| **Monorepo** | npm workspaces, Turbo 1.11 |
| **Deployment** | Docker, Docker Compose, Vercel |

## Project Structure

```
/clout
├── apps/
│   ├── web/              # Next.js frontend (port 3000)
│   │   ├── app/          # App router (Next.js 14+)
│   │   │   ├── page.tsx  # Landing page with 3D animations
│   │   │   ├── layout.tsx
│   │   │   ├── auth/callback/    # OAuth callback handler
│   │   │   └── dashboard/        # Dashboard UI
│   │   └── package.json
│   ├── api/              # Express backend (port 3001)
│   │   ├── src/
│   │   │   ├── index.ts          # Server entry
│   │   │   ├── websocket.ts      # WebSocket server
│   │   │   ├── middleware/       # Auth, error handling
│   │   │   └── routes/           # API routes
│   │   └── package.json
│   └── bot/              # Discord bot
│       ├── src/
│       │   ├── index.ts          # Bot entry
│       │   ├── commands/         # Slash commands
│       │   └── events/           # Event handlers
│       └── package.json
├── packages/
│   ├── database/         # Prisma schema & client
│   │   ├── prisma/schema.prisma
│   │   └── src/index.ts
│   └── shared/           # Shared types & constants
│       ├── src/types.ts
│       └── src/constants.ts
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Package References

| Package | Import Name | Description |
|---------|-------------|-------------|
| Web | `clout-web` | Next.js app (no internal imports) |
| API | `@clout/api` | Express server |
| Bot | `@clout/bot` | Discord bot |
| Database | `@clout/database` | Prisma client export |
| Shared | `@clout/shared` | Types, constants, routes |

## Build and Development Commands

All commands should be run from the project root.

```bash
# Install dependencies for all packages
npm install

# Development (runs all apps in parallel with hot reload)
npm run dev

# Build all apps
npm run build

# Lint all apps
npm run lint

# Format code with Prettier
npm run format

# Database commands
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database (dev)
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio

# Individual app commands
cd apps/web && npm run dev     # Frontend only (localhost:3000)
cd apps/api && npm run dev     # API only (localhost:3001)
cd apps/bot && npm run dev     # Bot only
cd apps/bot && npm run deploy-commands  # Deploy slash commands
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/clout?schema=public"

# Discord Application (required) - Get from https://discord.com/developers/applications
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback

# JWT Secret (required) - Generate a random string
JWT_SECRET=your_random_jwt_secret

# API & Frontend URLs
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id

# Optional features
OPENAI_API_KEY=your_openai_api_key       # For AI chat feature
YOUTUBE_API_KEY=your_youtube_api_key     # For music feature
```

## Database Schema Overview

Key entities:
- **User**: Discord user with karma (good/bad deeds), balance
- **Server**: Discord server/guild with settings
- **ServerMember**: Many-to-many relationship
- **ServerSettings**: Feature toggles (economy, games, music, AI)
- **EmbedConfig**: Customizable embed appearance
- **CustomCommand**: Server-specific slash commands
- **Transaction**: Economy transactions (daily, transfers, games)
- **ChatHistory**: AI chat history
- **BotState**: Key-value store for bot state

## Code Style Guidelines

### TypeScript
- Strict mode enabled in all packages
- Target: ES2022, Module: ESNext
- Use explicit return types on exported functions
- Prefer `interface` over `type` for object shapes

### Naming Conventions
- Files: kebab-case.ts (e.g., `error-handler.ts`)
- Components: PascalCase.tsx (e.g., `Dashboard.tsx`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE or PascalCase for objects
- Database models: PascalCase (Prisma convention)

### Import Order
1. External dependencies
2. Internal packages (`@clout/*`)
3. Relative imports
4. Type-only imports last

### Discord Bot Commands Pattern
Each command is a module exporting:
```typescript
export const data = new SlashCommandBuilder()...
export async function execute(interaction: ChatInputCommandInteraction) { ... }
```

### API Routes Pattern
Use asyncHandler wrapper for async routes:
```typescript
import { asyncHandler, AppError } from '../middleware/errorHandler';

router.get('/path', asyncHandler(async (req, res) => {
  // Route logic
}));
```

### Error Handling
- Use `AppError` class for operational errors with status codes
- All errors are caught by `errorHandler` middleware
- Bot commands use try/catch with user-friendly error messages

## WebSocket Communication

The API server exposes WebSocket at `/ws` for real-time updates:

**Message types:**
- `auth`: Authenticate connection with userId
- `subscribe_bot_status`: Subscribe to bot status updates
- `get_stats`: Get global statistics

## Authentication Flow

1. User clicks "Login with Discord" on web
2. Redirect to Discord OAuth2 with scopes: `identify`, `guilds`, `email`
3. Discord redirects to `/auth/callback` with code
4. API exchanges code for access token, fetches user/guilds
5. User created/updated in database
6. JWT generated and returned to frontend via redirect
7. Frontend stores JWT in localStorage as `clout_token`
8. JWT used in Authorization header: `Bearer <token>`

## Bot Features

| Command | Description |
|---------|-------------|
| `/good <deed>` | Record a good deed (+1 karma) |
| `/bad <deed>` | Record a bad deed (-1 karma) |
| `/profile [@user]` | View karma profile with clout level |
| `/daily` | Claim daily reward (100 coins) |
| `/balance [@user]` | Check coin balance |
| `/pay @user <amount>` | Send coins to another user |
| `/leaderboard` | Top 10 richest users |
| `/trivia` | Answer trivia for 50 coins |
| `/rps <choice>` | Rock Paper Scissors |
| `/guess <1-10>` | Guess the number |
| `/command create/delete/list` | Manage custom commands |
| `/help` | View all commands |

## Frontend Architecture

- **App Router**: Uses Next.js 14+ app router structure
- **Styling**: Tailwind CSS v4 with custom glassmorphism utilities
- **3D Graphics**: Three.js + React Three Fiber for landing page
- **Animations**: GSAP with ScrollTrigger for scroll-based animations
- **State**: Zustand (if needed), otherwise React hooks
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives with custom styling

### Glassmorphism CSS Classes
```css
.glass           /* bg-white/5 backdrop-blur-xl border border-white/10 */
.glass-strong    /* bg-black/40 backdrop-blur-2xl border border-white/10 */
.gradient-text   /* gradient from indigo via purple to pink */
.glow            /* box-shadow glow effect */
.text-glow       /* text shadow glow */
```

## Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services:
- `postgres`: PostgreSQL 16 (port 5432)
- `api`: Express API (port 3001)
- `bot`: Discord bot
- `web`: Next.js frontend (port 3000)

## Vercel Deployment (Web Only)

```bash
cd apps/web
vercel --prod
```

See `vercel.json` for configuration.

## Security Considerations

- JWT tokens expire in 7 days
- Rate limiting: 100 requests per 15 minutes per IP
- Helmet.js for security headers
- CORS configured for frontend URL only
- Discord tokens never exposed to frontend
- Database uses connection pooling via Prisma

## Testing Strategy

Currently, this project does not have automated tests. When adding tests:
- Use Jest or Vitest for unit tests
- Use Playwright for E2E tests on the web frontend
- Mock Discord.js for bot command tests
- Use test database for integration tests

## Common Development Tasks

### Adding a New Bot Command
1. Create file in `apps/bot/src/commands/<name>.ts`
2. Export `data` (SlashCommandBuilder) and `execute` function
3. Run `npm run deploy-commands` in bot directory

### Adding a New API Route
1. Create/modify file in `apps/api/src/routes/`
2. Use `asyncHandler` wrapper for async routes
3. Import route in `apps/api/src/index.ts`

### Modifying Database Schema
1. Edit `packages/database/prisma/schema.prisma`
2. Run `npm run db:push` (dev) or `npm run db:migrate` (production)
3. Run `npm run db:generate` to update client

### Adding Shared Types
1. Add to `packages/shared/src/types.ts`
2. Export from `packages/shared/src/index.ts`
3. Rebuild shared package: `cd packages/shared && npm run build`

## Troubleshooting

**Port conflicts**: Change ports in `.env` files if 3000/3001 are in use

**Database connection errors**: Ensure PostgreSQL is running and DATABASE_URL is correct

**Discord API errors**: Check that bot token and client credentials are valid

**Command not appearing**: Run `npm run deploy-commands` after adding/modifying commands

**Build errors**: Ensure all packages are built: `npm run build`

## Useful Links

- [Discord.js Documentation](https://discord.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Discord Developer Portal](https://discord.com/developers/applications)
