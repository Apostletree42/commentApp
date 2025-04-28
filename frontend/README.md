# Comments App - Frontend

A modern comments app built with React and TypeScript that allows users to interact with comments, manage notifications, and more.

## Features

- **User Authentication**: Login and registration
- **Nested Comments**: Multi-level threaded conversations
- **Comment Management**: Create, edit, delete, and restore comments
- **Real-time Notifications**: Instant notifications for replies
- **Responsive Design**: Works on mobile and desktop

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

3. **Access the app**:  
   Open `http://localhost:80` in your browser.

## Configuration

The frontend connects to the backend API via Nginx. If you need to adjust settings:
- `src/utils/axios.ts` for API config
- `src/utils/sse.ts` for Server-Sent Events

## Development & Debugging

- **View logs**:  
  ```bash
  docker-compose logs frontend
  ```

- Use browser developer tools for front-end debugging.

## Component Structure

- **Auth**: Login and registration
- **Comments**: Display and manage comments
- **Notifications**: Manage notifications
- **Layout**: Shared layout components
- **Common**: Reusable UI components

## State Management

Uses **React Query** for efficient data fetching and state management.

## Real-time Notifications

- The app uses **Server-Sent Events (SSE)** for real-time notifications.
- Notifications appear when someone replies to a comment.

## Styling

Styled with **Tailwind CSS** for a clean and responsive design.

--- 