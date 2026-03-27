# Demo2CairoLive - Next.js 14 Project Setup

## Overview
Complete scaffolding for **demo2cairolive** — a community-driven rating and review platform for Egypt, built with Next.js 14 and clean architecture principles.

## Project Structure

### Configuration Files (Root Level)
- `package.json` — Dependencies and npm scripts
- `tsconfig.json` — TypeScript configuration with path aliases
- `next.config.mjs` — Next.js 14 configuration
- `tailwind.config.ts` — Tailwind CSS theme extension
- `postcss.config.mjs` — PostCSS plugins
- `drizzle.config.ts` — Drizzle ORM database configuration
- `vitest.config.ts` — Vitest testing framework setup
- `.env.example` — Environment variables template
- `.gitignore` — Git ignore rules

### Clean Architecture Layers

#### 1. Domain Layer (`src/domain/`)
- `entities/` — Core business entities
- `value-objects/` — Value objects and immutable data structures
- `repositories/` — Repository interfaces (contracts)
- `services/` — Domain business logic and services

#### 2. Application Layer (`src/application/`)
- `usecases/` — Use case implementations
  - `items/` — Item-related use cases
  - `reviews/` — Review-related use cases
  - `users/` — User-related use cases
- `dtos/` — Data Transfer Objects

#### 3. Infrastructure Layer (`src/infrastructure/`)
- `db/` — Database schema and client setup
- `repositories/` — Repository implementations (concrete implementations)
- `seeds/` — Database seed files

#### 4. Presentation Layer (`src/presentation/`)
- `app/` — Next.js App Router pages and layouts
  - `(marketing)/` — Marketing pages
  - `explore/[category]/` — Category exploration
  - `items/[slug]/` — Item detail pages
  - `submit/` — Item submission
  - `admin/` — Admin dashboard (reviews, items, settings)
  - `api/` — API routes and endpoints
    - `items/` — Item endpoints
    - `reviews/` — Review endpoints
    - `categories/` — Category endpoints
    - `search/` — Search functionality
    - `auth/[...nextauth]/` — Authentication
  - `auth/` — Auth pages (signin, signup)
- `components/` — React components
  - `ui/` — Base UI components
  - `items/` — Item-specific components
  - `reviews/` — Review-specific components
  - `layout/` — Layout components
  - `animations/` — GSAP animations

### Styling
- `src/presentation/app/globals.css` — Global CSS with Tailwind directives
- `src/presentation/app/layout.tsx` — Root layout with metadata and Google Fonts

## Key Technologies

### Core
- **Next.js 14.2.21** — React framework
- **React 18.3.1** — UI library
- **TypeScript 5.7.3** — Type safety

### Database & ORM
- **Drizzle ORM 0.38.3** — Type-safe ORM
- **@neondatabase/serverless** — Neon Postgres driver
- **Drizzle Kit** — Migration and schema management

### Authentication
- **NextAuth.js 5.0.0-beta.25** — Authentication library
- **@auth/drizzle-adapter** — Drizzle adapter for NextAuth
- **bcryptjs 2.4.3** — Password hashing

### UI & Styling
- **Tailwind CSS 3.4.17** — Utility-first CSS
- **Lucide React 0.469.0** — Icon library
- **GSAP 3.12.7** — Animation library
- **clsx 2.1.1** — Classname utility
- **tailwind-merge 2.6.0** — Merge Tailwind classes

### Validation
- **Zod 3.24.1** — Schema validation

### Testing
- **Vitest 2.1.8** — Unit/integration testing
- **@vitest/coverage-v8** — Code coverage

### Development Tools
- **ESLint 9.17.0** — Code linting
- **tsx 4.19.2** — TypeScript execution

## Design System

### Colors
- **Background**: `#FAFAF8`
- **Surface**: `#FFFFFF`
- **Primary**: `#E8572A` (Orange-red)
- **Secondary**: `#1A1A2E` (Dark blue)
- **Accent Gold**: `#F5C542`
- **Accent Green**: `#4CAF88`
- **Muted**: `#E8E8E4`
- **Text Primary**: `#1A1A2E`
- **Text Muted**: `#6B6B7B`

### Typography
- **Display Font**: DM Serif Display
- **Body Font**: Plus Jakarta Sans

### Spacing & Borders
- **Border Radius (Card)**: `16px`
- **Border Radius (Input)**: `12px`
- **Border Radius (Button)**: `8px`

### Shadows
- **Card Shadow**: `0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)`
- **Card Hover Shadow**: `0 4px 16px rgba(0,0,0,0.08), 0 12px 48px rgba(0,0,0,0.06)`

## Available npm Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate Drizzle migration files
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database with initial data
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage report
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
DATABASE_URL=             # PostgreSQL connection string
NEXTAUTH_SECRET=          # Secret for NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL=             # Application URL (default: http://localhost:3000)
GOOGLE_CLIENT_ID=         # Google OAuth Client ID
GOOGLE_CLIENT_SECRET=     # Google OAuth Client Secret
NEXT_PUBLIC_APP_URL=      # Public application URL
```

## Path Aliases

All imports use convenient path aliases defined in `tsconfig.json`:

```typescript
@/*                    → ./src/*
@/domain/*            → ./src/domain/*
@/application/*       → ./src/application/*
@/infrastructure/*    → ./src/infrastructure/*
@/presentation/*      → ./src/presentation/*
```

Example usage:
```typescript
import { Item } from '@/domain/entities/item';
import { CreateItemUseCase } from '@/application/usecases/items/create-item.use-case';
import { ItemRepository } from '@/infrastructure/repositories/item.repository';
```

## Next Steps

1. **Install Dependencies**: `npm install`
2. **Configure Environment**: Copy `.env.example` to `.env.local` and fill in values
3. **Setup Database**: Run `npm run db:push` to sync schema
4. **Start Development**: `npm run dev`

## Architecture Notes

This project follows **Clean Architecture** principles:
- **Domain Layer** contains business logic (no framework dependencies)
- **Application Layer** orchestrates use cases and data transformation
- **Infrastructure Layer** handles external concerns (DB, APIs, authentication)
- **Presentation Layer** handles UI and HTTP concerns (Next.js App Router)

All dependencies flow inward → Domain layer has zero external dependencies.

## Testing Requirements

Minimum test coverage: **80%**
- Unit tests for domain entities and services
- Integration tests for repositories and use cases
- E2E tests for critical user flows

---

**Created**: March 2026
**Project**: demo2cairolive - Egypt Rating & Review Platform
**Status**: Ready for development
