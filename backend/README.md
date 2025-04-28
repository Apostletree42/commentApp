# Comments App - Backend

A scalable backend for the comments application built with NestJS and TypeScript, providing a robust API for user authentication, comments, and real-time notifications.

## Features

- **User Authentication**: JWT-based secure authentication
- **Nested Comments**: Multi-level comment threads
- **Comment Management**: Create, read, update, and delete comments (with a 15-minute edit/restore window)
- **Real-time Notifications**: SSE for instant notifications on replies
- **Database Integration**: PostgreSQL with Mikro-ORM

## Docker Setup

### Prerequisites

- Docker and Docker Compose
- Git

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Start the containers**:
   ```bash
   docker-compose up -d
   ```

3. **Run the database migrations**:
   ```bash
   docker-compose exec backend npx mikro-orm migration:create --initial --config mikro-orm.migrations.ts
   docker-compose exec backend npx mikro-orm migration:up --config mikro-orm.migrations.ts
   ```

4. **Verify setup**:
   ```bash
   docker-compose ps
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Log in an existing user

### Comments
- `GET /comments` - Get all comments
- `POST /comments` - Create a new comment
- `GET /comments/:id` - Get a specific comment
- `PATCH /comments/:id` - Update a comment (within 15 minutes)
- `DELETE /comments/:id` - Soft delete a comment
- `POST /comments/:id/restore` - Restore a deleted comment (within 15 minutes)
- `GET /comments/:id/replies` - Get replies to a comment

### Notifications
- `GET /notifications` - Get user notifications
- `POST /notifications/:id/read` - Mark a notification as read
- `POST /notifications/read-all` - Mark all notifications as read

### Server-Sent Events
- `GET /sse/notifications` - Real-time notifications via SSE

## Environment Variables

Configured in `docker-compose.yml`:
- `NODE_ENV` - Environment (development/production)
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` - PostgreSQL settings
- `JWT_SECRET`, `JWT_EXPIRATION` - JWT settings
- `PORT` - Backend server port

## Development & Debugging

- **View logs**:  
  ```bash
  docker-compose logs backend
  ```

- **Access PostgreSQL**:  
  ```bash
  docker-compose exec postgres psql -U postgres -d comments
  ```

## Architecture

- **Modular structure**: Entities, services, and controllers
- **Event-based notifications**: Using EventEmitter
- **Real-time notifications**: Implemented with SSE

---