# Prisma Migration Flow

## 1. Overview

Prisma migrations apply changes defined in `schema.prisma` to the PostgreSQL database. Each change becomes a versioned SQL file stored in the repository, so the database history is reviewable and repeatable.

Whenever we add or change models, fields, relationships, indexes or constraints, we validate the schema, create a migration, review its SQL, apply it, and verify the result.

Project configuration:
- Schema file: `backend/prisma/schema.prisma`
- Prisma config: `backend/prisma7.config.ts`
- Database URL: `DATABASE_URL` in `backend/.env` (never committed)
- Generated client: `backend/src/generated/prisma` (not committed)

All commands are run from the `backend` folder.

## 2. Migration Workflow

### Step 1: Update `schema.prisma`

Add or change models in `prisma/schema.prisma`. This file defines:
- Models and fields, and their types
- Relationships, primary keys and foreign keys
- Indexes and unique constraints
- Default values and enums

### Step 2: Validate the schema

```bash
npx prisma validate
```

Checks that the schema is valid before a migration is created. Optionally run `npx prisma format` to tidy the file.

### Step 3: Create the migration without applying it

First migration:

```bash
npx prisma migrate dev --name init --create-only
```

Later changes use a name that describes the change:

```bash
npx prisma migrate dev --name add_learning_goals --create-only
```

This creates a folder in `prisma/migrations/` containing a `migration.sql` file. `--create-only` does not apply it to the database yet.

### Step 4: Review `migration.sql`

Open `prisma/migrations/<timestamp>_<name>/migration.sql` and read the SQL Prisma generated. Check that:
- the expected tables, columns and enums are created
- nothing is dropped by accident

Prisma cannot express some constraints in the schema, such as partial unique indexes. This is the reason for creating the migration first: add that raw SQL at the end of `migration.sql` before applying. Example from this project (one active goal per user):

```sql
CREATE UNIQUE INDEX "learning_goals_one_active_per_user"
ON "learning_goals" ("user_id")
WHERE "status" = 'ACTIVE';
```

### Step 5: Apply the migration

```bash
npx prisma migrate dev
```

Applies pending migrations to the development database and records them in Prisma's migration history (the `_prisma_migrations` table).

### Step 6: Regenerate the Prisma Client

```bash
npx prisma generate
```

Rebuilds the typed client in `src/generated/prisma` so the code matches the new schema.

### Step 7: Verify the database

Check with psql:

```bash
psql -U postgres -d studypilot -c "\dt"
```

Or in pgAdmin: `Servers > PostgreSQL > Databases > studypilot > Schemas > public > Tables`, then refresh. Confirm the expected tables, columns, relationships, constraints and indexes exist. Also run:

```bash
npx prisma migrate status
```

It should report that the database schema is up to date.

### Step 8: Commit

Commit `schema.prisma` and the whole `prisma/migrations/` folder. Review `git status` and `git diff --staged` before committing.

Do not commit:
- `src/generated/prisma`
- `.env`

## 3. Rules to Remember

- Never edit a migration after it has been applied. Any later change goes in a new migration.
- `migrate dev` is for development only. In production, use `npx prisma migrate deploy`, which only applies migrations that already exist.
- `npx prisma migrate reset` deletes all data in the database. Use it only in development.
- Prefer adding columns and tables over renaming or deleting them. Renames can drop data unless the SQL is edited carefully.
- Add new nullable columns, or columns with defaults, when tables already contain rows.

## 4. Key Files and Tools

## Prisma Files and Commands Reference

| File / Tool                   | Purpose                                                                            |
|-------------------------------|------------------------------------------------------------------------------------|
| `schema.prisma`               | Defines the database structure using Prisma models.                                |
| `migration.sql`               | Contains SQL generated for a schema change, along with any custom SQL we add.      |
| `prisma/migrations/`          | Stores migration folders and migration history, which are committed to Git.        |
| `prisma7.config.ts`           | Configures Prisma, including reading `DATABASE_URL` from `.env`.                   |
| `npx prisma validate`         | Validates the Prisma schema for errors.                                            |
| `npx prisma migrate dev`      | Creates and applies pending migrations in development.                             |
| `npx prisma generate`         | Generates or rebuilds the Prisma Client based on the schema.                       |
| `npx prisma migrate deploy`   | Applies existing migrations in production.                                         |
| `psql` / pgAdmin              | Tools for connecting to, inspecting, and querying the PostgreSQL database.         |

## 5. Workflow Summary

1. Change `schema.prisma`.
2. `npx prisma validate`
3. `npx prisma migrate dev --name <name> --create-only`
4. Review `migration.sql`, and add raw SQL if needed.
5. `npx prisma migrate dev`
6. `npx prisma generate`
7. Verify with psql or pgAdmin, and run `npx prisma migrate status`.
8. Commit the schema and the migrations folder.