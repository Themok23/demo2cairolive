# CLAUDE.md - Demo2cairolive

## Project Overview
- Client: Cairo Live (Internal/Demo)
- Project Type: Full-Stack Web Application - Community Rating Platform
- Owner: Mohamed Mokhtar - The Mok Company
- Started: 2026-03-27
- Status: In Progress
- Platform: demo2cairolive
- Tagline: "Rate anything in Egypt."

---

## What We Are Building

A community-driven rating and review platform focused entirely on Egypt. Users can discover, add, and rate anything: restaurants, cosmetics, street food carts, university faculties, gyms, apps, beaches, local brands, hotels, clinics, and more. Everything is treated as a "listable item" with a unified rating system. No marketplace, no prices shown by default, but an optional price tag / price range field for context (EGP). Think Yelp x Product Hunt x Letterboxd, built for Egypt.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Animations | GSAP + ScrollTrigger |
| Backend API | Next.js Route Handlers (clean architecture) |
| Database | Neon (PostgreSQL serverless) via @neondatabase/serverless |
| ORM | Drizzle ORM |
| Auth | NextAuth.js v5 (email/password + Google OAuth) |
| Image hosting | Cloudinary (free tier) or Next.js Image with placeholder |
| Deployment | Vercel |

---

## Architecture

Clean Architecture in Next.js:
- `src/domain/` - Pure business logic, zero framework deps
- `src/application/` - Use cases (one class = one action)
- `src/infrastructure/` - All I/O: DB, external APIs
- `src/presentation/` - Next.js layer: pages, components, API routes

---

## Identity Override

**Product & Dev mode** - Structured, spec-driven, engineering-minded. Jinx operates as Mohamed's right hand with a dev-first lens on this project.

---

## THE MOK COMPANY STANDARDS

Before doing anything in this project, refer to `context/guidelines.md` in the main workspace for The Mok Company's non-negotiable standards.

Key rules:
- File naming: `[ClientCode]-[DocumentType]-[Version]-[Status].ext`
  Example: `D2CL-CompanyProfile-v2.1-CLIENT-REVIEW.pptx`
- Standard project subfolders: `00-Brief/`, `01-Research/`, `02-Content/`, `03-Design/`, `04-Exports/`, `05-Client-Comms/`, `06-Final/`
- All exports go in `04-Exports/` - never overwrite a version
- Nothing ships without passing `/review`
- Get all client feedback in writing - log it in `05-Client-Comms/`

---

## Key Non-Negotiables

- All business logic lives in `domain/` and `application/` - zero Drizzle or Next.js imports there
- Route handlers are max 20 lines - they instantiate the use case and return the result
- All repository interfaces are in `domain/repositories/` - implementations in `infrastructure/`
- Reviews have hard status gate: only `status = 'approved'` reviews are shown publicly
- Admin `auto_approve_reviews` setting is checked in `SubmitReview` use case at runtime
- GSAP is loaded client-side only (`'use client'` components) - never in server components
- All Egyptian seed data must use real, accurate information
- Price fields are informational only - never "buy now" or cart functionality
- Mobile-first responsive design throughout
- Lighthouse score target: Performance 90+, Accessibility 95+

---

## Available Commands

- `/prime` - Load full company context before starting work
- `/review` - Check any deliverable against The Mok Company standards
- `/spec` - Turn a feature description into a full product spec
- `/ticket` - Break a spec into team tasks
- `/test` - Auto-generate test cases for new code

---

## Key Decisions Made on This Project

- 2026-03-27: Project folder created with full master prompt spec. Clean architecture with Next.js 14, Drizzle ORM, Neon PostgreSQL, NextAuth v5.
- 2026-03-27: Identity mode set to Product & Dev (Jinx + engineering-minded).

---

## MEMORY SYSTEM

This folder contains a file called MEMORY.md. It is your external memory for this workspace - use it to bridge the gap between sessions.

**At the start of every session:** Read MEMORY.md before responding. Use what you find to inform your work - don't announce it, just be informed by it.

**Memory is user-triggered only.** Do not automatically write to MEMORY.md. Only add entries when the user explicitly asks - using phrases like "remember this," "don't forget," "make a note," "log this," "save this," or "create session notes." When triggered, write the information to MEMORY.md immediately and confirm you've done it.

**All memories are persistent.** Entries stay in MEMORY.md until the user explicitly asks to remove or change them.

**Flag contradictions.** If the user asks you to remember something that conflicts with an existing memory, don't silently overwrite it. Flag the conflict and ask how to reconcile it.
