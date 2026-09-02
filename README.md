# PlanPlus

PlanPlus is a gamified task manager built with Next.js, React, PostgreSQL, and Prisma. It combines everyday task management with achievements, points, badges, reminders, notes, and productivity reports.

[Live demo](https://plan-plus.vercel.app/)

## Features

- Create, update, filter, categorize, complete, and delete tasks.
- Add due dates, reminders, and completion notes.
- Unlock repeatable and one-time achievements.
- Progress through badges based on earned points.
- Review task metrics and a six-month completion report.
- Sign in with credentials or GitHub.

## Tech stack

- Next.js 15 and React 19
- TypeScript
- PostgreSQL and Prisma ORM
- NextAuth.js
- Zod
- Tailwind CSS and DaisyUI
- Jest and Testing Library

## Local development

Requirements: Node.js 22, npm, and PostgreSQL.

1. Copy `.env.example` to `.env.development` and set the development values. Use a separate `.env.production` for production commands.
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Apply database migrations and seed reference data:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks for every push and pull request targeting `main`.

### Existing database

The first migration is a baseline of the schema that existed before migration history was added. If an existing PlanPlus database already has that schema, back it up, mark only the baseline as applied, and then deploy the hardening migration:

```bash
npm run db:baseline:production
npm run db:migrate:deploy
npm run db:seed:production
```

Fresh production databases should run `npm run db:migrate:deploy`. Development uses `npm run db:migrate`.

## Docker

The production image uses a multi-stage build and runs the Next.js standalone server as a non-root user.

```bash
docker build -t planplus .
docker run --env-file .env -p 8080:8080 planplus
```

## Project structure

- `src/app`: routes, pages, and server actions
- `src/contexts`: client-side domain state
- `src/lib`: shared components, schemas, and server-side domain logic
- `src/types`: explicit shared application types
- `prisma`: database schema, migrations, and seed data
- `__tests__`: component and server-action tests
