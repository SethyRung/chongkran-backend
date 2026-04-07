# 🍳 Recipe Web App Backend

This is the backend service for the Recipe Web Application built using **NestJS**, **MongoDB**, and **Mongoose**. It provides RESTful APIs for managing users, recipes, categories, and more.

## 📦 Tech Stack

- **NestJS** - Framework for building scalable server-side applications.
- **MongoDB** - NoSQL database.
- **Mongoose** - MongoDB ORM for schema modeling.
- **JWT Authentication** - Secure access with login and protected routes.
- **Role-based Access Control** - `admin`, `author`, and `user`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v22+
- npm or pnpm or yarn
- MongoDB instance (local or cloud like Atlas)
- Docker & Docker Compose (optional, for running containers)

### Installation

```bash
git clone https://github.com/SethyRung/Chongkran-Backend.git
cd chongkran-backend
pnpm install
```

### Database Seeding

Make sure `DATABASE_URL` points to a reachable MongoDB instance, then run:

```bash
pnpm seed
```

The seed script writes directly to MongoDB, hashes the default seed password with bcrypt, and upserts the seeded user accounts so rerunning it repairs old bad hashes. It also recreates the pending author requests for the author seed accounts. `SEED_DEFAULT_PASSWORD` overrides the login password and defaults to `Password123!`.

### Environment Variables

Create a .env file:

```bash
# Environment
PORT="sever_port"

# API Information
API_CURRENT_VERSION="1.0"
API_DESCRIPTION="Nest JS & MongoDB"
API_NAME="Chongkran API"
API_ROOT="api/docs"
SITE_TITLE="Chongkran"

# Database Connection
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=supersecret
DATABASE_URL=mongodb://admin:supersecret@mongo:27017/chongkran?authSource=admin

# Authentication
ACCESS_TOKEN_SECRET="your_access_token_secret"
ACCESS_TOKEN_EXPIRATION="15m"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
REFRESH_TOKEN_EXPIRATION="1d"

# CORS Configuration
ALLOW_ORIGIN="your_frontend_url"

# File Storage
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### Run locally

```bash
pnpm start:dev
```

### Docker Setup (Optional)

#### 1. Build and start containers

```bash
docker-compose up --build
```

#### 2. Access backend

http://localhost:8080/api

[Api Docs](http://localhost:8080/api/docs#/)

#### 3. Services

- `backend`: NestJS application
- `mongo`: MongoDB database

### 📁 Project Structure

```bash
src/
├── auth/               # Authentication (JWT)
├── users/              # User management
├── recipes/            # Recipe CRUD, likes, views
├── categories/         # Category management
├── common/             # Guards, decorators, interceptors
└── main.ts             # Entry point
```

### 🔐 Authentication & Roles

- Register/Login → Receive JWT
- Use Authorization: Bearer <token> for protected endpoints
- Roles: admin, author, user
  - Only admin & author can create recipes
  - All users can like/view recipes

### 🧪 API Endpoints (sample)

| Method | Endpoint                | Description             | Auth |
| ------ | ----------------------- | ----------------------- | ---- |
| POST   | `/api/auth/signup`      | Register a user         | ❌   |
| POST   | `/api/auth/login`       | Login and get token     | ❌   |
| GET    | `/api/recipes`          | List all recipes        | ❌   |
| GET    | `/api/recipes/:id`      | Get single recipe       | ❌   |
| POST   | `/api/recipes`          | Create recipe           | ✅   |
| POST   | `/api/recipes/:id/like` | Toggle like on a recipe | ✅   |
| POST   | `/api/recipes/:id/view` | Increment recipe views  | ❌   |

### Reponse Structure

```js
{
  status: {
    code: string, // ApiResponseCode
    message: string,
    requestId: string,
    requestTime: number,
  },
  data: T
}
```

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 Author

Made with ❤️ by [Sethy](https://github.com/SethyRung)
