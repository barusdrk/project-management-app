# Project Management App

A full-stack project management application for creating projects, organizing tasks, tracking task status, and managing user accounts. Built with **React, TypeScript, Express, MongoDB, and Tailwind CSS**.

## Features

* User registration and authentication
* JWT-based authentication
* User profile management
* Create, view, and delete projects
* Create, edit, and delete tasks
* Task status management
* Task due dates
* Prevent task due dates before the current day
* Search and filter tasks
* Task pagination
* Project-specific task management
* Dashboard with project and task statistics
* Light and dark mode
* Responsive design
* Account deletion
* Protected application routes
* REST API
* MongoDB data persistence
* Production deployment support

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Tailwind CSS
* Lucide React

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

### Deployment

* Vercel — frontend
* Render — backend
* MongoDB Atlas — database

## Project Structure

```text
project-management-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   └── package.json
├── server/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   ├── .env
│   └── package.json
├── LICENSE
└── README.md
```

## Application Routes

### Frontend

| Route           | Description               |
| --------------- | ------------------------- |
| `/login`        | User login                |
| `/register`     | User registration         |
| `/dashboard`    | Dashboard overview        |
| `/projects`     | Projects list             |
| `/projects/:id` | Project details and tasks |
| `/profile`      | User profile              |

### API

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a user        |
| POST   | `/api/auth/login`    | Authenticate a user    |
| GET    | `/api/auth/me`       | Get authenticated user |
| POST   | `/api/auth/logout`   | Logout                 |
| GET    | `/api/users/me`      | Get profile            |
| PUT    | `/api/users/me`      | Update profile         |
| DELETE | `/api/users/me`      | Delete account         |
| GET    | `/api/projects`      | Get projects           |
| POST   | `/api/projects`      | Create project         |
| GET    | `/api/projects/:id`  | Get project            |
| DELETE | `/api/projects/:id`  | Delete project         |
| GET    | `/api/tasks`         | Get tasks              |
| POST   | `/api/tasks`         | Create task            |
| GET    | `/api/tasks/:id`     | Get task               |
| PUT    | `/api/tasks/:id`     | Update task            |
| DELETE | `/api/tasks/:id`     | Delete task            |

All protected API endpoints require a valid JWT access token.

## Task Management

Tasks support three statuses:

* To Do
* In Progress
* Completed

Tasks can also have:

* Title
* Description
* Due date
* Project association
* Status

Due dates are validated so that a task cannot be assigned a date before the current day.

## Authentication

The application uses JWT-based authentication.

After successful registration or login, the frontend stores the authentication token and sends it with API requests using the `Authorization` header:

```text
Authorization: Bearer <token>
```

Protected routes require authentication.

## Environment Variables

### Client

Create `client/.env`:

```env
VITE_API_URL=http://localhost:10000/api
```

For production, replace the local API URL with the deployed Render backend URL:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Server

Create `server/.env`:

```env
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

For production:

```env
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-frontend.vercel.app
```

Do not commit `.env` files or production secrets to Git.

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/barusdrk/project-management-app.git
cd project-management-app
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment variables

Create `server/.env` and add your MongoDB connection string and JWT secret.

### 4. Start the backend

```bash
npm run dev
```

The API will run at:

```text
http://localhost:10000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Configure frontend environment variables

Create `client/.env`:

```env
VITE_API_URL=http://localhost:10000/api
```

### 7. Start the frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Production Build

### Backend

From `server/`:

```bash
npm run build
```

Start the compiled application with:

```bash
npm start
```

### Frontend

From `client/`:

```bash
npm run build
```

The production frontend is generated in:

```text
client/dist
```

## Deployment

### Backend — Render

Create a Render Web Service connected to this repository.

Use:

```text
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start
```

Configure the required environment variables in Render:

```text
MONGODB_URI
JWT_SECRET
CLIENT_URL
```

`CLIENT_URL` must contain the deployed frontend URL.

Example:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend — Vercel

Create a Vercel project connected to this repository.

Set the root directory to:

```text
client
```

Configure:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

The frontend must use the deployed backend URL rather than `localhost`.

## CORS

The backend uses `CLIENT_URL` to allow requests from the deployed frontend.

For local development:

```env
CLIENT_URL=http://localhost:5173
```

For production:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

Do not use the backend URL as `CLIENT_URL`. `CLIENT_URL` should identify the frontend origin that is making browser requests to the API.

## Security

* Passwords are hashed with bcryptjs.
* Authentication uses signed JWTs.
* Protected API routes require authentication.
* Users can access only their own projects and tasks.
* MongoDB queries are scoped to the authenticated user.
* Production secrets are stored as deployment environment variables.
* `.env` files should not be committed to the repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Derek Barus**

GitHub: [@barusdrk](https://github.com/barusdrk)
