# Project Standards

## Stack Defaults

Frontend:
- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- React Hook Form
- Zod

Backend:
- Node.js
- TypeScript
- Prisma
- PostgreSQL

General:
- pnpm
- ESLint
- Prettier

# Repository Conventions

Expected folders:

apps/
packages/
components/
lib/
hooks/
services/
types/
prisma/
public/
design/

# Design Folder Convention

If ./design exists:
- analyze images before coding
- infer application flow
- infer reusable UI patterns

Image names should be treated as semantic hints.

# Decision Memory

If DECISIONS.md exists:
- treat it as architectural source of truth

If ARCHITECTURE.md exists:
- follow it strictly
