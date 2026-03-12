# NestJS Task Manager API

Small NestJS backend for user signup/login and task CRUD, using JWT auth and PostgreSQL.

## What this project does

- User signup and login
- JWT-protected profile endpoints
- JWT-protected task create, list, update, and delete endpoints
- Swagger API docs at `/api`
- PostgreSQL database with Docker Compose

## Tech stack

- NestJS
- TypeORM
- PostgreSQL
- Docker Compose
- Swagger

## Easiest way to run

These steps are for anyone who clones the repo from GitHub.

### 1. Go to the backend folder

```powershell
cd backend
```

### 2. Create a local `.env` file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

### 3. Edit `.env`

Set at least these values:

```env
BACKEND_IMAGE=gantyadasreeja/nest-crud-backend:latest
JWT_SECRET=change-me
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=change-me
DB_NAME=nest_crud
```

Notes:

- `BACKEND_IMAGE` should point to the image published on Docker Hub
- `DB_HOST=postgres` should stay as-is when using Docker Compose
- `JWT_SECRET` and `DB_PASSWORD` should be changed for local use

### 4. Run the project

```powershell
docker compose up
```

This will:

- pull the backend image from Docker Hub
- start a PostgreSQL container
- start the backend container

### 5. Open the app

- API: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/api`

## Stop the project

```powershell
docker compose down
```

## Common Docker commands

Start again:

```powershell
docker compose up
```

Run in background:

```powershell
docker compose up -d
```

View logs:

```powershell
docker compose logs -f
```

Stop and remove containers:

```powershell
docker compose down
```

## Run without Docker

You can also run locally without Docker, but PostgreSQL must already be installed and running.

```powershell
npm install
npm run start:dev
```

Make sure `.env` points to your local PostgreSQL instance if you use this method.

## API summary

User routes:

- `POST /users/signup`
- `POST /users/login`
- `GET /users/profile`
- `PATCH /users/profile`

Task routes:

- `POST /tasks`
- `GET /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## For the maintainer: publish image to Docker Hub

Run these commands from the `backend` folder:

```powershell
docker login
docker build -t gantyadasreeja/nest-crud-backend:latest .
docker push gantyadasreeja/nest-crud-backend:latest
```

Then update `BACKEND_IMAGE` in `.env.example` if you want the repo to point to your real published image by default.

## Important notes

- `.env` is ignored by git and should never be committed
- `.env.example` is the file that should be committed
- If someone only runs the backend image without PostgreSQL, the app will not work unless they provide a separate database
