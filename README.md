## Pre-requisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

Alternatively, you can use Docker and Docker-compose to run the database.
- Docker (Optional)
- Docker-compose (Optional)

## Description

This is a simple REST API for a business management application. The application allows users to create businesses and add staff to the businesses.

## Features

- CRUD operations for businesses and staff
- User authentication
- User registration
- JWT authentication

## Endpoints

| Method | Endpoint                   | Description                    | Protected |
|--------|----------------------------|--------------------------------|-----------|
| POST   | /auth/login                | User login                     | No        |
| POST   | /users/register            | User registration              | No        |
| GET    | /business                  | Get all businesses             | No        |
| POST   | /business                  | Create a new business          | Yes       |
| GET    | /business/:id              | Get a specific business        | No        |
| PATCH  | /business/:id              | Update a specific business     | Yes       |
| DELETE | /business/:id              | Delete a specific business     | Yes       |
| GET    | /business/:id/staff        | Get all staff of a business    | Yes       |
| POST   | /business/:id/staff        | Add staff to a business        | Yes       |
| GET    | /business/:id/staff/:staffId | Get a specific staff member | Yes       |
| PATCH  | /business/:id/staff/:staffId | Update a specific staff member | Yes       |
| DELETE | /business/:id/staff/:staffId | Delete a specific staff member | Yes       |

**Note:**
Register a user and login to get the JWT token. Add the token to the Authorization header to access the protected endpoints.
Example:
```bash
curl -X POST "http://localhost:3001/auth/login" -H "Content-Type: application/json" -d '{"username":"your username", password:"your password"}'
```
The response will contain the token.
```bash
{
  userId: "your user id",
  username: "your username",
  email: "your email",
  "token": "the token"
}
```

Add the token to the Authorization header to access the protected endpoints.
```bash
curl -X GET "http://localhost:3001/business/1/staff -H "Authorization: Bearer <your token>"
```



You can also use Postman or any other API client to test the endpoints.

## Technologies

- Node.js
- Nest.js
- PostgreSQL
- JWT Authentication

## Environment Variables

**For development, copy the .env.example file to .env.dev.local and update the values accordingly.**

| Variable         | Description                       |
|------------------|-----------------------------------|
| DB_HOST          | Hostname for PostgreSQL database  |
| DB_PORT          | Port for PostgreSQL database      |
| DB_PASSWORD      | Password for PostgreSQL database  |
| DB_USER          | Username for PostgreSQL database  |
| DB_NAME          | Name of the PostgreSQL database   |
| DB_DROP_SCHEMA   | Flag to drop existing schema      |
| ADMINER_PORT     | Port for Adminer (Optional)       |
| APP_JWT_SECRET   | Secret key for JWT authentication |
| APP_PORT         | Port for running the application  |

## Database

- If you have PostgreSQL installed, you can create a database and update the environment variables in the .env file.

Alternatively, you can use Docker and Docker-compose to run the database. Run the following command to start the database.
```bash
$ docker-compose up
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
For end-to-end testing, copy the .env.example file to .env.e2e.local and update the values accordingly.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
