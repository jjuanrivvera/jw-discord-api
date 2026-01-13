# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the REST API backend for the **JW Discord Bot ecosystem**. The ecosystem consists of three interconnected projects:

| Project | Purpose | Stack |
|---------|---------|-------|
| `jw-discord-api` (this repo) | REST API for OAuth2 and management | Node.js, Express, MongoDB |
| `jw-discord-bot` | Discord bot with commands and scheduled tasks | Node.js, Discord.js v12, MongoDB |
| `jw-discord-frontend` | Web dashboard for bot management | Vue 2, Vuetify, Vuex |

## Ecosystem Data Flow

```
┌─────────────────┐     OAuth2      ┌─────────────────┐
│   Frontend      │◄───────────────►│   API           │
│   (Vue.js)      │     /api/v1     │   (Express)     │
└────────┬────────┘                 └────────┬────────┘
         │                                   │
         │ VUE_APP_JW_DISCORD_API            │ DISCORD_TOKEN
         │                                   │
         │              ┌────────────────────┘
         │              │
         │              ▼
         │      ┌─────────────────┐
         │      │   MongoDB       │
         │      │   (shared)      │
         │      └────────┬────────┘
         │               │
         │               ▼
         │      ┌─────────────────┐
         └─────►│   Discord Bot   │◄────► Discord API
                │   (Discord.js)  │
                └─────────────────┘
```

**Key Integration Points:**
- All three projects share the same MongoDB database
- API and Bot both use the same Discord application credentials
- Frontend authenticates via API's Discord OAuth2 flow (`/api/v1/auth/login`)
- Frontend fetches guilds via API (`/api/v1/guilds`) which proxies Discord API

## Commands

```bash
# Install dependencies
npm install

# Development (with hot reload)
npm run dev

# Production
npm start

# Docker
docker-compose up -d
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Bot token (same as jw-discord-bot) |
| `DISCORD_CLIENT_ID` | OAuth2 client ID |
| `DISCORD_CLIENT_SECRET` | OAuth2 client secret |
| `DISCORD_REDIRECT` | OAuth2 callback URL |
| `MONGO_DSN` | MongoDB connection (shared with bot) |
| `JWT_SECRET` | Secret for JWT token generation |

## Architecture

### Dependency Injection with Awilix

All dependencies registered in `src/startup/container.js` with constructor injection:

```javascript
// Register new components
container.register({
  MyService: asClass(MyService).singleton(),
  MyController: asClass(MyController).singleton(),
})
```

### Layered Architecture

```
Routes → Controllers → Services → Repositories → Models
                           ↓
                        API (Discord)
```

| Layer | Location | Purpose |
|-------|----------|---------|
| Routes | `src/routes/` | Define endpoints, wire middlewares |
| Controllers | `src/controllers/` | Handle HTTP request/response |
| Services | `src/services/` | Business logic (extend `BaseService`) |
| Repositories | `src/repositories/` | Data access (extend `BaseRepository`) |
| Models | `src/models/` | Mongoose schemas |
| API | `src/api/` | External API clients (extend `BaseApi`) |

### API Endpoints

Base path: `/api/v1`

| Route | Purpose |
|-------|---------|
| `POST /auth/login` | Exchange Discord OAuth2 code for JWT |
| `POST /auth/discord` | Generate Discord OAuth2 URL |
| `GET /guilds` | List user's guilds (with bot status) |
| `GET /guilds/:guildId` | Get specific guild details |
| `GET /users` | User management |

### Authentication Flow

1. Frontend redirects to Discord OAuth2 (via `POST /auth/discord`)
2. User authorizes, Discord redirects back with code
3. Frontend sends code to `POST /auth/login`
4. API exchanges code with Discord for tokens
5. API creates/updates user in MongoDB
6. API returns JWT to frontend
7. Frontend includes `Authorization: Bearer <token>` in subsequent requests

### Shared MongoDB Collections

These collections are shared between API and Bot:

| Collection | Used By | Purpose |
|------------|---------|---------|
| `users` | API, Bot | Discord user profiles with OAuth tokens |
| `servers` (guilds) | API, Bot | Per-server configuration |
| `schedules` | Bot | Scheduled daily text/news posts |
| `texts` | Bot | Cached daily texts |
| `news` | Bot | Cached news articles |

### Middleware Stack

Applied in `src/routes/index.js`:
- `cors` - Cross-origin requests (required for frontend)
- `helmet` - Security headers
- `compression` - Response compression
- `express-async-errors` - Async error handling
- `auth.middleware.js` - JWT verification for protected routes

## Related Projects

### jw-discord-bot
- **Location**: `../jw-discord-bot`
- **Commands**: `npm run dev` / `npm start`
- **Key files**:
  - `src/app.js` - Bot initialization and scheduler
  - `src/commands/` - Bot commands by category
  - `src/helpers/` - JW.org content fetching

### jw-discord-frontend
- **Location**: `../jw-discord-frontend`
- **Commands**: `npm run serve` / `npm run build`
- **Key files**:
  - `src/core/services/api.service.js` - API client
  - `src/core/services/store/auth.module.js` - Auth Vuex module
  - `src/core/services/store/guild.module.js` - Guild Vuex module
- **Config**: Set `VUE_APP_JW_DISCORD_API` to this API's URL
