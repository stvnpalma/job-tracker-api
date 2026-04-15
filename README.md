# Job Tracker API

A REST API to track job applications through every stage — from applied to offer.

Built with Node.js, Express, and PostgreSQL. Deployed on AWS.
Tested with Jest and Postman.

## Endpoints (growing as I build)

| Method | Route             | Description           |
| ------ | ----------------- | --------------------- |
| GET    | /applications     | Get all applications  |
| GET    | /applications/:id | Get one application   |
| POST   | /applications     | Add a new application |
| PUT    | /applications/:id | Update an application |
| DELETE | /applications/:id | Delete an application |

## Tech Stack

- Node.js
- Express
- PostgreSQL + Prisma
- Jest + Supertest
- AWS (EC2, RDS)
- TypeScript (migrating to this after JS foundations)

## Status

In active development — built lesson by lesson
