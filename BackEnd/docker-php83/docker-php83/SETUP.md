# Project Setup Guide

Follow these steps to set up the development environment.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## 1. Environment Configuration
Copy the example environment file and configure it.

```bash
cd src
cp .env.example .env
```

Ensure your `.env` has the following database configuration to match `docker-compose.yml`:

```ini
DB_CONNECTION=mysql
DB_HOST=mysql-db
DB_PORT=3306
DB_DATABASE=pastry_ecommerce
DB_USERNAME=user
DB_PASSWORD=pass
```

## 2. Start Docker Containers
Build and start the containers.

```bash
# Run from the project root (where docker-compose.yml is)
docker compose up -d --build
```

## 3. Install Dependencies
Install PHP and Node.js dependencies inside the container.

```bash
# Install PHP dependencies
docker compose exec app composer install

# Install Node.js dependencies and build assets
docker compose exec app npm install
docker compose exec app npm run build
```

## 4. Database Setup
Generate the application key and set up the database.

```bash
# Generate App Key
docker compose exec app php artisan key:generate

# Run Migrations
docker compose exec app php artisan migrate

# Run Seeders (Populate database with initial data)
docker compose exec app php artisan db:seed
```

## 5. Access the Application
- **Frontend/API**: [http://localhost:8082](http://localhost:8082)
- **phpMyAdmin**: [http://localhost:8081](http://localhost:8081)

## Common Commands

### Re-run Migrations (Fresh Start)
If you need to reset the database completely:
```bash
docker compose exec app php artisan migrate:fresh --seed
```

### Access Container Shell
```bash
docker compose exec app bash
```
