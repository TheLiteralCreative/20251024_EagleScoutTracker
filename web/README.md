## Path-to-Eagle Tracker Web App

This directory contains the Next.js application that will eventually replace the Excel workbook with a multi-user web experience.

The current focus is a single-scout rank tracker page backed by Postgres + Prisma with seed data to mirror a subset of the workbook.

---

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the local Postgres stack)

---

## 1. Environment

Create a `.env` file based on the provided example:

```bash
cp .env.example .env
```

The default connection string expects the Docker Compose setup in the repository root.

---

## 2. Database (Docker)

From the repository root (not this `web/` folder), start the containers:

```bash
docker compose up -d
```

This launches:

- `postgres:16-alpine` on port `5432`
- `pgAdmin` at [http://localhost:5050](http://localhost:5050) (email `admin@example.com`, password `changeme`)

Stop the stack with `docker compose down` when finished.

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Prisma

Generate the Prisma client, run the first migration, and seed the sample data:

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

> If migrations fail, confirm Docker Desktop is running and the containers are healthy.

---

## 5. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the responsive rank tracker.

---

## Next Steps

- Flesh out the Prisma schema with the remaining workbook tables.
- Introduce authentication (NextAuth) and role-based access.
- Build leader/admin dashboards and export workflows.
