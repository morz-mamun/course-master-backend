# Course Master Backend

A comprehensive RESTful API backend for a Learning Management System (LMS) built with Node.js, Express, TypeScript, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Courses](#courses)
  - [Student Operations](#student-operations)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication & Authorization**
  - JWT-based authentication with HTTP-only cookies
  - Role-based access control (Student/Admin)
  - Secure password hashing with bcrypt

- **Course Management**
  - Create, read, update, and delete courses (Admin)
  - Full-text search on course titles and descriptions
  - Filter by category and tags
  - Pagination and sorting support
  - Batch-based enrollment system

- **Student Features**
  - Course enrollment
  - Progress tracking with percentage calculation
  - Assignment submissions (text or link)
  - Quiz attempts with auto-grading
  - Personal dashboard with enrolled courses

- **Data Models**
  - Users (Students & Admins)
  - Courses with syllabus and batches
  - Enrollments
  - Progress tracking
  - Assignments with submissions
  - Quizzes with attempts

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Development**: Nodemon, ts-node
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## 📦 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- pnpm (or npm/yarn)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd course-master-backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/coursemaster

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=13

# Admin Seeder
ADMIN_EMAIL=admin@coursemaster.com
ADMIN_PASSWORD=Admin@123
```

## 💾 Database Setup

1. **Ensure MongoDB is running**

2. **Create admin user** (optional)
   ```bash
   pnpm run seed
   ```
   This creates an admin user with credentials from `.env`

## 🏃 Running the Application

### Development Mode

```bash
pnpm run dev
```

Server runs on `http://localhost:5000` with hot-reload enabled.

### Production Mode

```bash
# Build TypeScript to JavaScript
pnpm run build

# Start production server
pnpm start
```

## 📚 API Documentation

Base URL: `http://localhost:5000`

### Authentication

All authenticated endpoints require a JWT token stored in HTTP-only cookies.

#### Register User

Creates a new user account.

**Endpoint:** `POST /api/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:** `201 Created`

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Email already registered"
}
```

---

#### Login

Authenticates a user and sets authentication cookie.

**Endpoint:** `POST /api/auth/login`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Sets Cookie:**

```
token=<jwt_token>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Invalid credentials"
}
```

---

#### Logout

Clears the authentication cookie.

**Endpoint:** `POST /api/auth/logout`

**Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

---

#### Get Current User

Retrieves the authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Headers:**

```
Cookie: token=<jwt_token>
```

**Response:** `200 OK`

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Not authenticated"
}
```

---

### Courses

#### Get All Courses

Retrieves a paginated list of courses with optional filtering.

**Endpoint:** `GET /api/courses`

**Query Parameters:**

- `search` (optional): Search term for title/description
- `category` (optional): Filter by category
- `tags` (optional): Comma-separated tags
- `sort` (optional): `price_asc`, `price_desc`, `newest` (default: `newest`)
- `page` (optional): Page number (default: `1`)
- `limit` (optional): Items per page (default: `10`)

**Example Request:**

```
GET /api/courses?search=javascript&category=programming&page=1&limit=10&sort=price_asc
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "JavaScript Fundamentals",
      "description": "Learn JavaScript from scratch",
      "instructor": "507f1f77bcf86cd799439012",
      "price": 49.99,
      "category": "programming",
      "tags": ["javascript", "web development"],
      "enrollmentCount": 150,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

#### Get Course by ID

Retrieves detailed information about a specific course.

**Endpoint:** `GET /api/courses/:id`

**Parameters:**

- `id`: Course ID

**Response:** `200 OK`

```json
{
  "course": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch",
    "instructor": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "price": 49.99,
    "category": "programming",
    "tags": ["javascript", "web development"],
    "syllabus": [
      {
        "lessonId": "lesson-1",
        "title": "Introduction to JavaScript",
        "duration": 30,
        "videoUrl": "https://example.com/video1.mp4",
        "description": "Overview of JavaScript"
      }
    ],
    "batches": [
      {
        "batchId": "batch-1",
        "startDate": "2024-02-01T00:00:00.000Z",
        "endDate": "2024-04-01T00:00:00.000Z",
        "capacity": 50,
        "enrolledCount": 30
      }
    ],
    "enrollmentCount": 150,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "Course not found"
}
```

---

#### Create Course (Admin Only)

Creates a new course.

**Endpoint:** `POST /api/courses/admin/create`

**Headers:**

```
Content-Type: application/json
Cookie: token=<admin_jwt_token>
```

**Request Body:**

```json
{
  "title": "Advanced React Patterns",
  "description": "Master advanced React concepts and patterns",
  "price": 79.99,
  "category": "web development",
  "tags": ["react", "javascript", "frontend"],
  "syllabus": [
    {
      "lessonId": "lesson-1",
      "title": "Higher Order Components",
      "duration": 45,
      "videoUrl": "https://example.com/video1.mp4",
      "description": "Learn about HOCs"
    }
  ],
  "batches": [
    {
      "batchId": "batch-1",
      "startDate": "2024-03-01T00:00:00.000Z",
      "endDate": "2024-05-01T00:00:00.000Z",
      "capacity": 30
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Advanced React Patterns",
    "description": "Master advanced React concepts and patterns",
    "instructor": "507f1f77bcf86cd799439012",
    "price": 79.99,
    "category": "web development",
    "tags": ["react", "javascript", "frontend"],
    "syllabus": [...],
    "batches": [...],
    "enrollmentCount": 0,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Response:** `403 Forbidden`

```json
{
  "error": "Admin access required"
}
```

---

#### Update Course (Admin Only)

Updates an existing course.

**Endpoint:** `PUT /api/courses/admin/:id`

**Headers:**

```
Content-Type: application/json
Cookie: token=<admin_jwt_token>
```

**Parameters:**

- `id`: Course ID

**Request Body:** (partial update supported)

```json
{
  "title": "Advanced React Patterns - Updated",
  "price": 89.99
}
```

**Response:** `200 OK`

```json
{
  "message": "Course updated successfully",
  "course": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Advanced React Patterns - Updated",
    "price": 89.99,
    ...
  }
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "Course not found"
}
```

---

#### Delete Course (Admin Only)

Deletes a course.

**Endpoint:** `DELETE /api/courses/admin/:id`

**Headers:**

```
Cookie: token=<admin_jwt_token>
```

**Parameters:**

- `id`: Course ID

**Response:** `200 OK`

```json
{
  "message": "Course deleted successfully"
}
```

---

### Student Operations

#### Enroll in Course

Enrolls the authenticated student in a course.

**Endpoint:** `POST /api/enroll`

**Headers:**

```
Content-Type: application/json
Cookie: token=<jwt_token>
```

**Request Body:**

```json
{
  "courseId": "507f1f77bcf86cd799439011",
  "batchId": "batch-1"
}
```

**Response:** `201 Created`

```json
{
  "message": "Enrolled successfully",
  "enrollment": {
    "_id": "507f1f77bcf86cd799439014",
    "courseId": "507f1f77bcf86cd799439011",
    "studentId": "507f1f77bcf86cd799439015",
    "batchId": "batch-1",
    "enrolledAt": "2024-01-20T10:30:00.000Z",
    "status": "active"
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Already enrolled in this course"
}
```

---

#### Get Student Courses

Retrieves all courses the authenticated student is enrolled in.

**Endpoint:** `GET /api/student/courses`

**Headers:**

```
Cookie: token=<jwt_token>
```

**Response:** `200 OK`

```json
{
  "courses": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "courseId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "JavaScript Fundamentals",
        "description": "Learn JavaScript from scratch",
        "category": "programming",
        "price": 49.99,
        "enrollmentCount": 150
      },
      "studentId": "507f1f77bcf86cd799439015",
      "batchId": "batch-1",
      "enrolledAt": "2024-01-20T10:30:00.000Z",
      "status": "active",
      "progress": {
        "_id": "507f1f77bcf86cd799439016",
        "studentId": "507f1f77bcf86cd799439015",
        "courseId": "507f1f77bcf86cd799439011",
        "lessonsCompleted": 5,
        "totalLessons": 20,
        "percentage": 25,
        "completedLessonIds": [
          "lesson-1",
          "lesson-2",
          "lesson-3",
          "lesson-4",
          "lesson-5"
        ]
      }
    }
  ]
}
```

---

#### Update Progress

Marks a lesson as completed and updates progress.

**Endpoint:** `POST /api/progress`

**Headers:**

```
Content-Type: application/json
Cookie: token=<jwt_token>
```

**Request Body:**

```json
{
  "courseId": "507f1f77bcf86cd799439011",
  "lessonId": "lesson-6"
}
```

**Response:** `200 OK`

```json
{
  "message": "Progress updated",
  "progress": {
    "_id": "507f1f77bcf86cd799439016",
    "studentId": "507f1f77bcf86cd799439015",
    "courseId": "507f1f77bcf86cd799439011",
    "lessonsCompleted": 6,
    "totalLessons": 20,
    "percentage": 30,
    "completedLessonIds": [
      "lesson-1",
      "lesson-2",
      "lesson-3",
      "lesson-4",
      "lesson-5",
      "lesson-6"
    ],
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

---

#### Submit Assignment

Submits an assignment for grading.

**Endpoint:** `POST /api/assignments`

**Headers:**

```
Content-Type: application/json
Cookie: token=<jwt_token>
```

**Request Body:** (provide either `submissionText` or `submissionLink`)

```json
{
  "assignmentId": "507f1f77bcf86cd799439017",
  "submissionText": "My assignment solution...",
  "submissionLink": "https://github.com/user/assignment-repo"
}
```

**Response:** `201 Created`

```json
{
  "message": "Assignment submitted successfully",
  "submission": {
    "studentId": "507f1f77bcf86cd799439015",
    "submissionText": "My assignment solution...",
    "submissionLink": "https://github.com/user/assignment-repo",
    "submittedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

**Error Response:** `400 Bad Request`

```json
{
  "error": "Either submission text or link must be provided"
}
```

---

#### Submit Quiz

Submits quiz answers for grading.

**Endpoint:** `POST /api/quiz/submit`

**Headers:**

```
Content-Type: application/json
Cookie: token=<jwt_token>
```

**Request Body:**

```json
{
  "quizId": "507f1f77bcf86cd799439018",
  "answers": [0, 2, 1, 3, 0],
  "timeTaken": 450
}
```

**Response:** `200 OK`

```json
{
  "message": "Quiz submitted",
  "attempt": {
    "studentId": "507f1f77bcf86cd799439015",
    "answers": [0, 2, 1, 3, 0],
    "score": 80,
    "attemptedAt": "2024-01-20T13:00:00.000Z",
    "timeTaken": 450
  },
  "passed": true,
  "passingScore": 70
}
```

---

## 📁 Project Structure

```
course-master-backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── index.ts         # Environment variables
│   │   ├── database.ts      # MongoDB connection
│   │   └── jwt.ts           # JWT utilities
│   │
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── course.controller.ts
│   │   └── student.controller.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── error-handler.ts
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Enrollment.ts
│   │   ├── Progress.ts
│   │   ├── Assignment.ts
│   │   └── Quiz.ts
│   │
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── courses.routes.ts
│   │   └── student.routes.ts
│   │
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── course.service.ts
│   │   └── student.service.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts
│   │   └── validation.ts
│   │
│   ├── scripts/             # Database seeders
│   │   └── admin-seeder.ts
│   │
│   └── index.ts             # Application entry point
│
├── dist/                    # Compiled JavaScript (generated)
├── node_modules/            # Dependencies
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## ⚠️ Error Handling

The API uses consistent error response formats:

### Validation Errors (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "path": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Authentication Errors (401)

```json
{
  "error": "Invalid or expired token"
}
```

### Authorization Errors (403)

```json
{
  "error": "Admin access required"
}
```

### Not Found Errors (404)

```json
{
  "error": "Course not found"
}
```

### Server Errors (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Md Morshed Alam Mamun - Initial work

## 🙏 Acknowledgments

- MISUN Academy for the technical assessment
- Express.js community
- MongoDB team
- TypeScript team
