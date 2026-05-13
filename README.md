# Job Tracker API

A REST API to track job applications through every stage — from applied to offer.

Built with Node.js, TypeScript, Express, and PostgreSQL. Deployed on AWS EC2 with RDS.
Tested with Jest and Supertest. CI/CD with GitHub Actions.

## Live API

Base URL: `http://18.206.220.166:3000`

## Endpoints

| Method | Route               | Description                                                  |
| ------ | ------------------- | ------------------------------------------------------------ |
| GET    | /applications       | Get all applications (supports ?status and ?company filters) |
| GET    | /applications/:id   | Get one application                                          |
| GET    | /applications/stats | Get stats grouped by status                                  |
| POST   | /applications       | Add a new application                                        |
| PUT    | /applications/:id   | Update an application                                        |
| DELETE | /applications/:id   | Delete an application                                        |

## Tech Stack

- Node.js + Express
- TypeScript (strict mode)
- PostgreSQL + Prisma ORM
- Jest + Supertest (38 tests — unit and integration)
- GitHub Actions CI
- AWS EC2 + RDS PostgreSQL

## Releases

- v1.0.0 — CRUD routes
- v2.0.0 — TypeScript migration
- v3.0.0 — PostgreSQL database layer
- v4.0.0 — Integration tests + GitHub Actions CI
- v5.0.0 — Full TypeScript codebase
- v6.0.0 — AWS EC2 + RDS deployment

## Status

✅ Live on AWS
