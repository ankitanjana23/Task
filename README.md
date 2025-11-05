# Category-Service-API (Node + Express + PostgreSQL)

This project provides secure CRUD APIs for Category and Services using JWT authentication.

# Features
- JWT token-based login (admin only)
- CRUD on categories
- CRUD on services within a category
- Multiple price options per service
- PostgreSQL + Sequelize ORM
- Clean MVC structure
- Ready Postman collection for testing

# Tech Stack
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication

## Setup Instructions

# 1️⃣ Clone the repository
git clone https://github.com/YOUR_USERNAME/category-service-api.git
cd category-service-api

# As a reference I use this in env file 
PORT=3000

# Postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=1234
DB_NAME=category_service_db

# JWT
JWT_SECRET=super-secret-jwt-key
JWT_EXPIRES_IN=1d

# Admin credentials (fixed)
ADMIN_EMAIL=admin@codesfortomorrow.com
ADMIN_PASSWORD='Admin123!@#'
