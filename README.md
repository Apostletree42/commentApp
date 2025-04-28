# Comments App

A scalable comments application built with React, TypeScript, and NestJS, offering features like nested comments, real-time notifications, and secure user authentication.

## Live Demo

**Live link**: https://treecomments.netlify.app/

**Note:** The backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. If the application seems unresponsive at first, please allow up to 50 seconds for the server to wake up on your first request.

## Development Setup Instructions

### Environment Configuration

1. **Create environment file**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit the .env file with appropriate values
   ```

### Local Setup 

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Start the containers**:
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**:
   ```bash
   docker-compose exec backend npx mikro-orm migration:create --initial --config mikro-orm.migrations.ts
   docker-compose exec backend npx mikro-orm migration:up --config mikro-orm.migrations.ts
   ```

4. **Verify setup**:
   ```bash
   docker-compose ps
   ```

Once the services are up, the app should be running on `http://localhost:80`.

---

## Production Setup Instructions

**Note:** Before proceeding with production deployment, ensure that:
- Database is already set up and configured
- Required `.env` file is placed in the backend directory with production credentials
- Server has Docker and Docker Compose installed

### Production Deployment

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Configure environment variables**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit the .env file with production configurations
   ```

3. **Build the production containers**:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

4. **Start the production services**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Verify deployment**:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

6. **Access the production application**:
   Your application should be accessible on port 80 of your server.

学习需要耐心和毅力。(Xuéxí xūyào nàixīn hé yìlì.) Learning requires patience and perseverance.