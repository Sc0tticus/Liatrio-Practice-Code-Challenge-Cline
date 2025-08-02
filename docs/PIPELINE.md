# CI/CD Pipeline Documentation

## Overview

This project implements a comprehensive CI/CD pipeline using GitHub Actions that automates testing, building, security scanning, and deployment of the Liatrio Todo List application.

## Pipeline Architecture

The pipeline consists of several jobs that run in sequence and parallel:

```
┌─────────────┐    ┌─────────────┐
│    Test     │    │  Security   │
│   & Lint    │    │    Scan     │
└─────┬───────┘    └─────────────┘
      │
      ▼
┌─────────────┐
│    Build    │
│  & Push     │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│   Deploy    │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│   Notify    │
└─────────────┘
```

## Pipeline Stages

### 1. Test & Lint Stage

**Triggers:** All pushes and pull requests
**Duration:** ~3-5 minutes

This stage performs comprehensive code quality checks:

- **Dependency Installation**: Installs npm dependencies for both backend and frontend
- **Linting**: Runs ESLint on TypeScript code to ensure code quality standards
- **Type Checking**: Validates TypeScript types across the entire codebase
- **Unit Testing**: Executes Jest tests with coverage reporting
- **Coverage Upload**: Sends test coverage data to Codecov

**Key Commands:**

```bash
# Backend
npm run lint
npm run type-check
npm test

# Frontend
npm run lint
npm run type-check
npm test -- --coverage --watchAll=false
```

### 2. Security Scan Stage

**Triggers:** After successful test stage
**Duration:** ~2-3 minutes

Performs security vulnerability scanning:

- **Trivy Scanner**: Scans filesystem for known vulnerabilities
- **SARIF Upload**: Uploads security findings to GitHub Security tab
- **Dependency Audit**: Checks for vulnerable npm packages

### 3. Build & Push Stage

**Triggers:** Only on pushes to `main` branch after successful tests
**Duration:** ~5-8 minutes

Builds and publishes Docker images:

- **Multi-stage Docker Build**: Optimized build process with separate stages for backend and frontend
- **Multi-platform Support**: Builds for both AMD64 and ARM64 architectures
- **Container Registry**: Pushes to GitHub Container Registry (ghcr.io)
- **Image Tagging**: Tags with branch name, commit SHA, and 'latest' for main branch
- **Build Caching**: Uses GitHub Actions cache to speed up subsequent builds

**Docker Build Process:**

1. **Backend Builder Stage**: Compiles TypeScript backend code
2. **Frontend Builder Stage**: Builds React application for production
3. **Production Stage**: Creates minimal runtime image with compiled assets

### 4. Deploy Stage

**Triggers:** Only on pushes to `main` branch after successful build
**Duration:** ~2-4 minutes

Deploys to Google Cloud Run:

- **Service Configuration**: Configures Cloud Run service with appropriate resources
- **Environment Variables**: Sets production environment variables
- **Health Checks**: Configures container health checks
- **Auto-scaling**: Sets up automatic scaling based on traffic

**Deployment Configuration:**

- **Memory**: 512Mi
- **CPU**: 1 vCPU
- **Scaling**: 0-10 instances
- **Concurrency**: 100 requests per instance

### 5. Notification Stage

**Triggers:** Always runs after all other stages complete
**Duration:** ~30 seconds

Provides pipeline status notifications:

- **Success Notifications**: Confirms successful deployment
- **Failure Notifications**: Reports which stages failed
- **Status Summary**: Provides overview of pipeline execution

## Environment Configuration

### Required Secrets

The pipeline requires the following GitHub secrets:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Google Cloud credentials (for deployment):
  - Service account key with Cloud Run permissions
  - Project ID configuration

### Environment Variables

**Production Environment:**

- `NODE_ENV=production`
- `PORT=8080`
- `FRONTEND_URL`: Set automatically by Cloud Run

## Pipeline Features

### 🚀 **Automated Testing**

- Unit tests for both backend and frontend
- Type checking with TypeScript
- Code quality enforcement with ESLint
- Test coverage reporting

### 🔒 **Security First**

- Vulnerability scanning with Trivy
- Dependency auditing
- SARIF security reporting
- Non-root container execution

### 📦 **Optimized Builds**

- Multi-stage Docker builds for minimal image size
- Build caching for faster execution
- Multi-platform support (AMD64/ARM64)
- Automated image tagging and versioning

### ☁️ **Cloud Deployment**

- Serverless deployment to Google Cloud Run
- Automatic scaling based on demand
- Health checks and monitoring
- Zero-downtime deployments

### 📊 **Monitoring & Observability**

- Pipeline status notifications
- Build and deployment metrics
- Security scan results
- Test coverage tracking

## Pipeline Optimization

### Build Performance

- **Parallel Jobs**: Test and security scan run in parallel
- **Dependency Caching**: npm dependencies cached between runs
- **Docker Layer Caching**: Docker build layers cached for faster builds
- **Conditional Execution**: Build and deploy only run on main branch

### Resource Efficiency

- **Multi-stage Builds**: Separate build and runtime environments
- **Minimal Base Images**: Alpine Linux for smaller image sizes
- **Dependency Optimization**: Production-only dependencies in final image

## Troubleshooting

### Common Issues

**1. Test Failures**

```bash
# Run tests locally
cd backend && npm test
cd frontend && npm test
```

**2. Linting Errors**

```bash
# Fix linting issues
cd backend && npm run lint:fix
cd frontend && npm run lint:fix
```

**3. Type Errors**

```bash
# Check types locally
cd backend && npm run type-check
cd frontend && npm run type-check
```

**4. Build Failures**

```bash
# Test Docker build locally
docker build -f docker/Dockerfile .
```

### Pipeline Debugging

1. **Check GitHub Actions logs** for detailed error messages
2. **Review security scan results** in the Security tab
3. **Verify environment variables** are properly configured
4. **Test locally** before pushing to ensure pipeline success

## Future Improvements

### Planned Enhancements

- **Integration Tests**: End-to-end testing with Playwright
- **Performance Testing**: Load testing with k6
- **Blue-Green Deployment**: Zero-downtime deployment strategy
- **Monitoring Integration**: Application performance monitoring
- **Automated Rollback**: Automatic rollback on deployment failures

### Metrics & Analytics

- **Build Time Tracking**: Monitor pipeline performance over time
- **Success Rate Monitoring**: Track pipeline reliability
- **Security Metrics**: Monitor vulnerability trends
- **Deployment Frequency**: Track deployment velocity

## Best Practices

### Code Quality

- All code must pass linting and type checking
- Minimum 80% test coverage required
- Security vulnerabilities must be addressed before deployment

### Git Workflow

- Feature branches for development
- Pull requests required for main branch
- Automated checks prevent broken code from merging

### Security

- Regular dependency updates
- Security scanning on every commit
- Secrets managed through GitHub Secrets
- Non-root container execution

This pipeline demonstrates modern DevOps practices and provides a solid foundation for continuous integration and deployment of the Todo List application.
