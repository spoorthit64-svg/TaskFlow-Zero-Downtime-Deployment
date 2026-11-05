# TaskFlow – Enterprise Task Management & Agile Delivery Platform

TaskFlow is a modern, responsive, SaaS-grade Task Management Web Application designed for agile engineering teams. Built with a decoupled **React + Vite + Tailwind CSS** frontend and a robust **Java Spring Boot 3 + Spring Security + MongoDB Atlas** backend, TaskFlow delivers end-to-end task workflows, interactive drag-and-drop Kanban execution, rich analytics, and zero-downtime deployment compatibility.

This application is architected to serve as the application workload for DevOps pipelines: **"Zero-Downtime Deployment and Rollback System"** utilizing Docker, Kubernetes, and cloud hosts.

---

## 1. Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Modern dark navy & crisp slate color system)
- **Routing**: React Router v7
- **HTTP Client**: Axios with automatic JWT Bearer interceptor & offline interceptor
- **Icons**: Lucide React
- **Hosting Target**: Vercel (equipped with SPA rewrite configuration)

### Backend
- **Framework**: Java 21 / Spring Boot 3.3.5
- **Security**: Spring Security 6 + JJWT 0.12.6 (stateless cryptographic Bearer tokens)
- **Password Hashing**: BCryptPasswordEncoder (strength 10)
- **Database Engine**: Spring Data MongoDB (configured for MongoDB Atlas cloud cluster)
- **Input Validation**: Jakarta Validation (Hibernate Validator)
- **Build System**: Apache Maven 3.9 + Maven Wrapper (`mvnw`, `mvnw.cmd`)
- **Hosting Target**: Render (dynamic `PORT` binding, cloud environment variables)

### Database
- **Provider**: MongoDB Atlas (Cloud Database)
- **Collections**: `users`, `tasks`
- **Security Model**: Strict multi-tenant user isolation (each task is cryptographically bound to its owner's `userId`)

---

## 2. Key Features

### Modern SaaS UI/UX Design
- **Theme**: Premium dark navy (`#0f172a`), deep indigo (`#4f46e5`), and neutral background with card elevation.
- **Micro-Interactions**: Smooth hover effects, badge animations, toast alerts, modal transitions, and responsive drawers.
- **Responsive Layout**: Fluid layouts across mobile (<640px), tablet (640px–1024px), and desktop (>1024px).
- **Resilience Banners**: Network offline banner with 1-click retry button, empty states, and loading skeletons.

### Landing Page & Public Tour
- SaaS hero section with headline, subheadline, and primary/secondary CTAs.
- **Interactive Live Preview**: Interactive mini-board allowing prospective users to test status toggling before registering.
- Value metrics bar (99.99% uptime target, <100ms API latency, zero-downtime architecture).
- Feature showcases covering Kanban, Analytics, JWT isolation, and Cloud Microservice readiness.

### Authentication & Account Security
- User registration with real-time password strength meter and confirmation validation.
- User login with password visibility toggle and 1-click demo credential filler.
- Stateless JWT generation and validation with 24-hour expiration.
- Protected client-side routes (`<ProtectedRoute>`) with auto-redirect on expiration.
- Cryptographic password verification with BCrypt.

### Interactive Dashboard
- 5 Executive KPI stat cards: Total Tasks, Completed, In Progress, Pending, and Completion Rate %.
- **SVG Donut Chart**: Visual distribution of task status breakdown with center completion percentage.
- **Priority Matrix Bar Chart**: High, Medium, and Low urgency breakdown with color-coded meters.
- Recent Deliverables feed with quick status changer and view details shortcut.

### Comprehensive Task Management
- Create, Edit, View, and Delete tasks with validation and confirmation modals.
- Prioritization: `LOW`, `MEDIUM`, `HIGH`.
- Lifecycle Statuses: `PENDING` (To Do), `IN_PROGRESS`, `COMPLETED`.
- Multi-Tag input system (add/remove `#tags`).
- Due dates with visual alert highlights when overdue or due today.
- Dual view modes: **Grid Cards View** and **Table List View**.
- Live full-text search across titles, descriptions, and tags.
- Multi-filtering by status, priority, and due dates.
- Bi-directional sorting by creation date, deadline, priority, or title.

### Drag-and-Drop Agile Kanban Board
- 3 Dedicated Columns: **To Do**, **In Progress**, **Completed**.
- HTML5 Drag and Drop with drop-zone highlight animations.
- Optimistic UI updates with automatic error rollback if connection drops.
- Column-specific "+ Add Task" triggers that pre-fill the selected status.

### Profile, Security & System Diagnostics
- Edit full name and view account metadata (User ID, Role, Email).
- Change password form with validation against current password.
- System diagnostics card showing active API Base URL, database status, and live health test.

### Cloud Health Check Endpoint
- Dedicated `GET /api/health` endpoint returning uptime, API version, and database connectivity.
- Non-blocking 1.5-second timeout safeguard ensures instant 200 OK responses on health probes even during database cold-starts.

---

## 3. Folder Structure

```
taskflow/
├── backend/                              # Spring Boot REST API
│   ├── .mvn/wrapper/                     # Maven wrapper binaries & properties
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskflow/
│   │   │   │   ├── config/
│   │   │   │   │   └── SecurityConfig.java         # Spring Security & CORS configuration
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java         # Register, Login, Profile endpoints
│   │   │   │   │   ├── TaskController.java         # Task CRUD, search, filter, stats
│   │   │   │   │   └── HealthController.java       # GET /api/health diagnostic endpoint
│   │   │   │   ├── dto/                            # Data Transfer Objects & payloads
│   │   │   │   ├── exception/
│   │   │   │   │   └── GlobalExceptionHandler.java # Centralized JSON error responses
│   │   │   │   ├── model/
│   │   │   │   │   ├── User.java                   # User entity (@Document "users")
│   │   │   │   │   ├── Task.java                   # Task entity (@Document "tasks")
│   │   │   │   │   ├── TaskStatus.java             # Enum: PENDING, IN_PROGRESS, COMPLETED
│   │   │   │   │   └── TaskPriority.java           # Enum: LOW, MEDIUM, HIGH
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java         # MongoRepository for users
│   │   │   │   │   └── TaskRepository.java         # MongoRepository for tasks
│   │   │   │   ├── security/
│   │   │   │   │   ├── JwtTokenProvider.java       # Token generator & JJWT validator
│   │   │   │   │   ├── JwtAuthenticationFilter.java# Bearer token filter
│   │   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   │   ├── UserPrincipal.java
│   │   │   │   │   └── JwtAuthEntryPoint.java      # 401 JSON error handler
│   │   │   │   ├── service/
│   │   │   │   │   ├── AuthService.java            # Auth business logic & BCrypt
│   │   │   │   │   └── TaskService.java            # Task logic & aggregate stats
│   │   │   │   └── TaskflowApplication.java        # Spring Boot main class
│   │   │   └── resources/
│   │   │       └── application.properties          # Environment-driven configuration
│   ├── .env.example                                # Backend environment reference
│   ├── .gitignore
│   ├── mvnw / mvnw.cmd                             # Maven wrapper scripts
│   └── pom.xml                                     # Maven dependencies (Java 21)
│
├── frontend/                             # React + Vite Client
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js                            # Axios instance with interceptors
│   │   │   ├── authApi.js                          # Auth API client
│   │   │   ├── taskApi.js                          # Task & stats API client
│   │   │   └── healthApi.js                        # Health check client
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx              # Permanent delete confirmation
│   │   │   ├── DonutChart.jsx                      # SVG task status chart
│   │   │   ├── NetworkBanner.jsx                   # Offline alert banner
│   │   │   ├── PriorityBarChart.jsx                # SVG priority distribution chart
│   │   │   ├── ProtectedRoute.jsx                  # Route guard for auth routes
│   │   │   ├── Sidebar.jsx                         # Collapsible dark navy navigation
│   │   │   ├── StatCard.jsx                        # Metric KPI card
│   │   │   ├── TaskCard.jsx                        # Reusable card with drag-and-drop
│   │   │   ├── TaskDetailsModal.jsx                # Full task inspection modal
│   │   │   ├── TaskModal.jsx                       # Create & Edit task modal
│   │   │   ├── ToastContainer.jsx                  # Floating alert notifications
│   │   │   └── TopHeader.jsx                       # Top navigation bar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx                     # User & token state provider
│   │   │   └── ToastContext.jsx                    # Toast notification provider
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx                 # App shell with Sidebar & Header
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx                     # Public marketing homepage
│   │   │   ├── LoginPage.jsx                       # Login with demo quick-fill
│   │   │   ├── RegisterPage.jsx                    # User registration
│   │   │   ├── DashboardPage.jsx                   # Overview KPIs & charts
│   │   │   ├── TasksPage.jsx                       # Task table & grid management
│   │   │   ├── KanbanPage.jsx                      # Interactive drag-and-drop board
│   │   │   ├── ProfilePage.jsx                     # Profile & settings page
│   │   │   └── NotFoundPage.jsx                    # 404 error page
│   │   ├── App.jsx                                 # Route configuration
│   │   ├── index.css                               # Tailwind CSS v4 styling
│   │   └── main.jsx                                # React DOM root entry
│   ├── .env.example                                # Frontend environment reference
│   ├── index.html                                  # Branded HTML shell
│   ├── package.json
│   ├── vercel.json                                 # Vercel SPA route rewrite rules
│   └── vite.config.js                              # Vite + Tailwind plugin config
│
├── .gitignore                                      # Project-wide ignore rules
└── README.md                                       # Full architectural guide
```

---

## 4. Prerequisites

Before running TaskFlow locally:
1. **Java Development Kit (JDK)**: Java 17, 21, or 24 installed (`java -version`).
2. **Node.js & npm**: Node.js v18+ and npm v9+ installed (`node -v && npm -v`).
3. **MongoDB Atlas Account** (or local MongoDB running on `localhost:27017`).

---

## 5. MongoDB Atlas Setup Guide

1. Sign in to your account at [cloud.mongodb.com](https://cloud.mongodb.com/).
2. Create a free shared cluster (e.g., `M0 Sandbox`).
3. **Database Access**: Under *Security* > *Database Access*, create a database user:
   - Username: `taskflow_user`
   - Password: `<generate_a_secure_password>`
   - Role: `Read and write to any database`
4. **Network Access**: Under *Security* > *Network Access*, click **Add IP Address**:
   - For local development: Choose **Add Current IP Address** or `0.0.0.0/0` (Allow access from anywhere).
   - For Render/Vercel production: Add `0.0.0.0/0` so cloud hosting containers can connect.
5. **Get Connection String**:
   - In your cluster dashboard, click **Connect** > **Drivers** > **Java**.
   - Copy the connection URI:
     ```
     mongodb+srv://taskflow_user:<password>@cluster0.abcde.mongodb.net/taskflow?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database password and ensure database name is `taskflow`.

---

## 6. How to Run Locally

### Step A: Configure Backend Environment
In `backend/`, copy `.env.example` or create an `application-local.properties` (or set environment variables):
```bash
cd backend
```

Set the environment variables in your terminal:
**PowerShell:**
```powershell
$env:PORT="8080"
$env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/taskflow?retryWrites=true&w=majority"
$env:JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

**Linux / macOS (Bash):**
```bash
export PORT=8080
export MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/taskflow?retryWrites=true&w=majority"
export JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
export CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

### Step B: Compile & Run Backend
Using the included Maven wrapper:
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
Or run the packaged JAR:
```bash
java -jar target/taskflow-backend-1.0.0.jar
```
*Backend will start on `http://localhost:8080`.*
Verify health: `http://localhost:8080/api/health`

### Step C: Configure & Run Frontend
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend will start on `http://localhost:5173`.*
Open your browser at `http://localhost:5173` to explore TaskFlow!

---

## 7. Environment Variables Reference

### Frontend (`frontend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend REST API | `http://localhost:8080` (Local) / `https://taskflow-api.onrender.com` (Production) |

### Backend (`backend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Listening server port (assigned dynamically by Render) | `8080` |
| `MONGODB_URI` | MongoDB Atlas cluster connection URI | `mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/taskflow` |
| `JWT_SECRET` | 256-bit cryptographic signing secret for tokens | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_EXPIRATION_MS` | JWT token lifetime in milliseconds | `86400000` (24 hours) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of permitted frontend origins | `http://localhost:5173,https://your-app.vercel.app` |

---

## 8. REST API Reference

All protected endpoints require the header: `Authorization: Bearer <token>`.

### Authentication Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Protected | Fetch currently logged-in user profile |
| `PUT` | `/api/auth/profile` | Protected | Update user display name |
| `PUT` | `/api/auth/change-password` | Protected | Verify current password & set new password |

### Task Management Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Protected | Query tasks with optional `status`, `priority`, `search`, `sortBy`, `sortDir` |
| `GET` | `/api/tasks/stats` | Protected | Fetch dashboard aggregated metrics & charts data |
| `GET` | `/api/tasks/{id}` | Protected | Fetch single task by ID |
| `POST` | `/api/tasks` | Protected | Create new task deliverable |
| `PUT` | `/api/tasks/{id}` | Protected | Update task attributes |
| `PATCH` | `/api/tasks/{id}/status` | Protected | Instant status change (Kanban drag-and-drop) |
| `DELETE` | `/api/tasks/{id}` | Protected | Delete task permanently |

### System & Health Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Return API status, version, uptime, and database connectivity |

---

## 9. Deployment Instructions

### Deploying Frontend to Vercel
1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and import your repository.
3. Configure the build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com` (your deployed Render URL)
5. Click **Deploy**. Vercel will build the frontend and serve it with the included `vercel.json` SPA routing rewrites.

### Deploying Backend to Render
1. In the Render Dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure service details:
   - **Name**: `taskflow-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Java` (or `Docker`)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/taskflow-backend-1.0.0.jar`
   - **Health Check Path**: `/api/health`
4. In **Environment Variables**, add:
   - `PORT`: `8080` (or let Render set dynamic PORT automatically)
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/taskflow?retryWrites=true&w=majority`
   - `JWT_SECRET`: `<your_256_bit_secret>`
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app` (your Vercel production domain)
5. Click **Create Web Service**. Render will build the JAR, bind to the assigned port, and verify health via `/api/health`.

---

## 10. Troubleshooting & Common Errors

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `Connection refused: getsockopt` / `Timed out while waiting for a server` | Local MongoDB is not running or `MONGODB_URI` is not configured | In your `.env` or Render environment, set `MONGODB_URI` with your valid MongoDB Atlas connection string. In MongoDB Atlas, ensure IP `0.0.0.0/0` is whitelisted. |
| `CORS policy: No 'Access-Control-Allow-Origin' header` | Frontend domain not present in backend CORS list | Add your Vercel URL to `CORS_ALLOWED_ORIGINS` in backend environment variables (e.g. `https://taskflow.vercel.app`). |
| `404 Not Found` when refreshing a page on Vercel | Single-page application route refresh issue | TaskFlow includes `frontend/vercel.json` with rewrite rules `{ "source": "/(.*)", "destination": "/" }` which handles client-side routing automatically. |
| `401 Unauthorized` on API calls | Expired or missing Bearer token | Sign out and sign in again. The frontend auto-handles 401 errors and prompts for re-authentication. |

---

## 11. Foundation for DevOps Project

TaskFlow is designed as the target microservice application for your upcoming DevOps project:

**"Zero-Downtime Deployment and Rollback System"**

Architectural advantages for this future DevOps project:
- **Stateless Application Tier**: JWT-based session architecture allows horizontal scaling across multiple pods/instances without sticky sessions.
- **Dedicated Health Probe**: `GET /api/health` conforms with Kubernetes Liveness and Readiness Probes (`livenessProbe`, `readinessProbe`).
- **Container-Ready Build**: Standard JAR in `backend/target/` and static bundle in `frontend/dist/` make Docker multi-stage builds straightforward.
- **Rollback Tolerant**: Decoupled APIs support blue-green deployments, canary releases, and zero-downtime rollbacks.