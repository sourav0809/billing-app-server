# Billing App Server

A Node.js/TypeScript API server for a billing application with AI-powered features using LangChain and Google GenAI.

> **💡 Quick Start**: If you have Make installed, simply run `make dev` to start the development environment!

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: PostgreSQL with Knex.js ORM and Objection.js
- **Validation**: Request validation using Zod
- **AI Integration**: LangChain with Google GenAI support
- **TypeScript**: Full TypeScript support with path aliases
- **Docker**: Containerized development environment
- **API**: RESTful API with versioned endpoints

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

### Required

- **Node.js**: Version 22.18.0 or higher
- **Docker**: For containerized development
- **Docker Compose**: For multi-container setup
- **Git**: For version control

### Optional (but Recommended)

- **Make**: Build automation tool for convenient shortcuts
  - **Windows**: Install via [Git for Windows](https://gitforwindows.org/) or [Chocolatey](https://chocolatey.org/) (`choco install make`)
  - **macOS**: Pre-installed with Xcode Command Line Tools, or install via [Homebrew](https://brew.sh/) (`brew install make`)
  - **Linux**: Usually pre-installed, or install via your package manager (`sudo apt-get install make`)

_Note: Make is optional - all commands can be run manually if preferred_

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd billing-app-server
   ```

2. **Install dependencies**:

   ```bash
   # Using yarn (recommended)
   yarn install

   # Or using npm
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Application Configuration
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-here
   SALT=10
   UUID_NAMESPACE=6ba7b810-9dad-11d1-80b4-00c04fd430c8

   # Database Configuration
   POSTGRES_HOST=localhost
   POSTGRES_DB=billing_db
   POSTGRES_USER=billing_user
   POSTGRES_PASSWORD=your-secure-password-here
   ```

## 🔧 Make (Build Automation Tool)

This project includes a **Makefile** that provides convenient shortcuts for common development tasks using the `make` command.

### What is Make?

**Make** is a build automation tool that:

- Automates repetitive development tasks
- Provides consistent command execution
- Works across different operating systems (Linux, macOS, Windows with WSL/Git Bash)
- Uses simple text files called "Makefiles" to define tasks

### Prerequisites for Make

**On Windows:**

- Install [Git for Windows](https://gitforwindows.org/) (includes Git Bash and Make)
- Or use [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
- Or install [Chocolatey](https://chocolatey.org/) and run: `choco install make`

**On macOS:**

- Make comes pre-installed with Xcode Command Line Tools
- Or install via [Homebrew](https://brew.sh/): `brew install make`

**On Linux:**

- Make is usually pre-installed, or install via your package manager:

  ```bash
  # Ubuntu/Debian
  sudo apt-get install make

  # CentOS/RHEL
  sudo yum install make

  # Arch Linux
  sudo pacman -S make
  ```

### Make Commands Available

The project provides these Make targets (defined in `makefile`):

```bash
# Start development environment (builds containers, runs migrations)
make dev

# Stop development environment and clean up
make down
```

## 🐳 Running with Docker (Recommended)

### Quick Start with Make (Easiest)

If you have Make installed, simply run:

```bash
# Start the entire development environment
make dev

# Stop and clean up when done
make down
```

### Manual Docker Commands (Alternative)

If you prefer to run commands manually or don't have Make:

#### Start Development Environment:

```bash
docker-compose -f docker-compose.dev.yaml up server --build --force-recreate --renew-anon-volumes --remove-orphans
```

#### Stop Development Environment:

```bash
docker-compose -f docker-compose.dev.yaml down -v --remove-orphans
```

### What Make Does

The `make dev` command automatically:

1. **Builds** the Docker containers (Node.js app + PostgreSQL)
2. **Starts** the database and application services
3. **Runs** database migrations automatically
4. **Sets up** hot-reload for development
5. **Mounts** your source code for live changes

The `make down` command:

1. **Stops** all running containers
2. **Removes** containers and networks
3. **Cleans** up Docker volumes (including database data)
4. **Resets** the environment for a fresh start

The application will be available at `http://localhost:3000`

### What's Included in Docker Setup:

- **Node.js 22.18.0** container with the application
- **PostgreSQL 16.6** database container
- **Hot reload** with volume mounting
- **Database persistence** with named volumes

## 🏃 Running Locally (Alternative)

If you prefer to run without Docker:

1. **Start PostgreSQL database** (using Docker or local installation):

   ```bash
   docker run --name billing-postgres -e POSTGRES_DB=billing_db -e POSTGRES_USER=billing_user -e POSTGRES_PASSWORD=your-password -p 5432:5432 -d postgres:16.6
   ```

2. **Run database migrations**:

   ```bash
   yarn build
   yarn start migrate:latest
   ```

3. **Start the development server**:
   ```bash
   yarn dev
   ```

## 📊 Database

The project uses PostgreSQL with Knex.js for migrations and Objection.js as the ORM.

### Available Migrations:

- `create_users` - User management table
- `create_plans` - Billing plans table
- `create_channels` - Channel management table

### Running Migrations:

```bash
# Build TypeScript first
yarn build

# Run migrations
npx knex migrate:latest --knexfile knexfile.ts
```

## 🏗️ Project Structure

```
billing-app-server/
├── src/
│   ├── config/          # Configuration files (DB, env, etc.)
│   ├── db/
│   │   ├── migrations/  # Database migrations
│   │   └── models/      # Objection.js models
│   ├── middlewares/     # Express middlewares (auth, validation, etc.)
│   ├── routes/          # API routes
│   │   └── v1/         # Version 1 API endpoints
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (JWT, bcrypt, etc.)
│   ├── validators/     # Zod validation schemas
│   ├── app.ts          # Express app setup
│   └── index.ts        # Application entry point
├── db/                 # Database data (for Docker volumes)
├── docker-compose.dev.yaml  # Development Docker setup
├── Dockerfile.dev      # Development Docker image
├── makefile           # Automation scripts
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── knexfile.ts        # Knex.js configuration
```

## 🔧 Available Scripts

```bash
# Development
yarn dev          # Start development server with nodemon
yarn build        # Build TypeScript to JavaScript
yarn start        # Start production server

# Database
yarn migrate:latest    # Run database migrations
yarn migrate:rollback  # Rollback last migration
```

## 🌐 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### User Management

- `GET /api/v1/me` - Get current user information

### Health Check

- `GET /health` - Application health check

## 🔒 Environment Variables

| Variable            | Description              | Default       | Required                   |
| ------------------- | ------------------------ | ------------- | -------------------------- |
| `NODE_ENV`          | Environment mode         | `development` | No                         |
| `PORT`              | Server port              | `3000`        | No                         |
| `JWT_SECRET`        | JWT signing secret       | `secret`      | Yes (change in production) |
| `SALT`              | Bcrypt salt rounds       | `10`          | No                         |
| `UUID_NAMESPACE`    | UUID namespace           | `uuid.v5.URL` | No                         |
| `POSTGRES_HOST`     | PostgreSQL host          | -             | Yes                        |
| `POSTGRES_DB`       | PostgreSQL database name | -             | Yes                        |
| `POSTGRES_USER`     | PostgreSQL username      | -             | Yes                        |
| `POSTGRES_PASSWORD` | PostgreSQL password      | -             | Yes                        |

## 🤖 AI Features

The application includes AI capabilities powered by:

- **LangChain**: For building AI applications
- **Google GenAI**: Google's generative AI models
- **LangGraph**: For creating complex AI workflows

## 🧪 Testing

_(Testing setup not implemented yet)_

## 📦 Deployment

For production deployment:

1. Build the application:

   ```bash
   yarn build
   ```

2. Set environment variables for production
3. Use a production-grade PostgreSQL instance
4. Consider using PM2 or similar process manager

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (when available)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
