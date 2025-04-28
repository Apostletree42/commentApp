# Comments App

A scalable comments application built with React, TypeScript, and NestJS, offering features like nested comments, real-time notifications, and secure user authentication.

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Git

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Start the containers**:
   ```bash
   docker-compose up -d
   ```

3. **Access the app**:  
   Open your browser and go to `http://localhost:80`.

### Backend Setup

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