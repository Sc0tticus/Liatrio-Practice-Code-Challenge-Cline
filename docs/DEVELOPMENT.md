# Development Guide

## Project Overview

This is a full-stack Todo List application built for the Liatrio DevOps challenge, demonstrating modern development practices with integrated CI/CD pipeline.

## Technology Stack

### Backend

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite
- **Testing**: Jest + Supertest
- **Linting**: ESLint with TypeScript rules

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App

### DevOps

- **Containerization**: Docker (multi-stage builds)
- **CI/CD**: GitHub Actions
- **Registry**: GitHub Container Registry
- **Deployment**: Google Cloud Run
- **Security**: Trivy vulnerability scanning

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Docker (optional, for containerization)
- Git

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd liatrio-todo-app
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**

   ```bash
   cd ../backend
   npm run dev
   ```

   The backend will start on http://localhost:3001

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm start
   ```
   The frontend will start on http://localhost:3000

## Development Workflow

### Code Quality

- **Linting**: Run `npm run lint` in both backend and frontend directories
- **Type Checking**: Run `npm run type-check` in both directories
- **Testing**: Run `npm test` in both directories
- **Auto-fix**: Use `npm run lint:fix` to automatically fix linting issues

### Git Workflow

1. Create feature branches from `main`
2. Make changes and commit with clear messages
3. Push to GitHub and create pull request
4. CI pipeline runs automatically
5. Merge after approval and successful checks

### Testing Strategy

#### Backend Tests

- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test API endpoints with supertest
- **Database Tests**: Test database operations with in-memory SQLite

#### Frontend Tests

- **Component Tests**: Test React components with React Testing Library
- **Integration Tests**: Test user interactions and API integration
- **Snapshot Tests**: Ensure UI consistency

### API Documentation

#### Endpoints

**Health Check**

- `GET /health` - Returns server health status

**Todos**

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get specific todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

#### Request/Response Examples

**Create Todo**

```bash
POST /api/todos
Content-Type: application/json

{
  "title": "Learn DevOps",
  "description": "Complete the Liatrio challenge"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Learn DevOps",
    "description": "Complete the Liatrio challenge",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Architecture Decisions

### Backend Architecture

- **Layered Architecture**: Controllers → Services → Database
- **Error Handling**: Centralized error handling middleware
- **Validation**: Input validation at controller level
- **Database**: SQLite for simplicity and portability
- **Security**: Helmet for security headers, CORS configuration

### Frontend Architecture

- **Component Structure**: Functional components with hooks
- **State Management**: React useState and useEffect
- **Routing**: Client-side routing with React Router
- **API Integration**: Axios with interceptors for logging
- **Styling**: CSS modules for component-scoped styles

### DevOps Architecture

- **Multi-stage Docker**: Separate build and runtime stages
- **Pipeline Stages**: Test → Security → Build → Deploy
- **Deployment**: Serverless with Google Cloud Run
- **Monitoring**: Health checks and logging

## Environment Configuration

### Development

```bash
# Backend
NODE_ENV=development
PORT=3001

# Frontend
REACT_APP_API_URL=http://localhost:3001/api
```

### Production

```bash
# Backend
NODE_ENV=production
PORT=8080

# Frontend (built into static files)
REACT_APP_API_URL=/api
```

## Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database Issues**

```bash
# Remove SQLite database file
rm backend/todos.db

# Restart backend to recreate database
cd backend && npm run dev
```

**Dependency Issues**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**

```bash
# Check types
npm run type-check

# Restart TypeScript service in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Performance Optimization

**Backend**

- Database indexing for frequently queried fields
- Response compression with gzip
- Request rate limiting
- Connection pooling for production databases

**Frontend**

- Code splitting with React.lazy()
- Image optimization and lazy loading
- Bundle analysis with webpack-bundle-analyzer
- Service worker for caching

## Security Considerations

### Backend Security

- Input validation and sanitization
- SQL injection prevention with parameterized queries
- CORS configuration for allowed origins
- Security headers with Helmet
- Rate limiting to prevent abuse

### Frontend Security

- XSS prevention with React's built-in escaping
- HTTPS enforcement in production
- Content Security Policy headers
- Secure cookie configuration

### DevOps Security

- Container security scanning with Trivy
- Dependency vulnerability scanning
- Secrets management with GitHub Secrets
- Non-root container execution
- Regular security updates

## Monitoring and Logging

### Application Monitoring

- Health check endpoints
- Request/response logging
- Error tracking and alerting
- Performance metrics

### Infrastructure Monitoring

- Container resource usage
- Database performance
- Network latency
- Deployment success rates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Deployment

### Manual Deployment

```bash
# Build Docker image
docker build -f docker/Dockerfile -t todo-app .

# Run locally
docker run -p 8080:3001 todo-app
```

### Automated Deployment

Deployment happens automatically via GitHub Actions when code is pushed to the `main` branch.

## Future Enhancements

### Planned Features

- User authentication and authorization
- Real-time updates with WebSockets
- Offline support with service workers
- Mobile app with React Native
- Advanced filtering and search

### Technical Improvements

- Database migration system
- Comprehensive integration tests
- Performance monitoring
- Automated rollback capabilities
- Blue-green deployment strategy

This development guide provides comprehensive information for working with the Liatrio Todo List application. For specific pipeline information, see [PIPELINE.md](./PIPELINE.md).
