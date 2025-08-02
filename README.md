# Liatrio Full-Stack DevOps-Enhanced Todo List

A modern todo list application with integrated CI/CD pipeline demonstrating full-stack development and DevOps practices.

## Architecture Overview

- **Frontend**: React with TypeScript, client-side routing
- **Backend**: Node.js/Express with TypeScript, RESTful API
- **Database**: SQLite for simplicity and portability
- **CI/CD**: GitHub Actions with automated testing, linting, and deployment
- **Deployment**: Docker containerization with cloud deployment

## Project Structure

```
├── frontend/         # React application
├── backend/          # Express.js API server
├── .github/workflows/ # CI/CD pipeline configuration
├── docker/           # Docker configuration
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for containerization)

### Local Development

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm start`

## CI/CD Pipeline

The pipeline includes:

- Automated unit tests
- TypeScript type checking
- ESLint code quality checks
- Docker image building
- Automatic deployment to cloud platform

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Development Process

This project was developed with AI assistance, focusing on:

- Modern TypeScript practices
- Test-driven development
- CI/CD best practices
- Clean architecture patterns
