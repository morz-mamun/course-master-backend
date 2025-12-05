# Course Master API - Testing Guide

Complete guide for testing all API endpoints using both **Postman** and **cURL**.

---

## 🚀 Postman API Testing Guide

### Getting Started with Postman

#### 1. Install Postman

Download and install Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

#### 2. Import Collection

You can manually create the collection following the steps below, or import a pre-configured collection.

**To create a new collection:**

1. Open Postman
2. Click "New" → "Collection"
3. Name it "Course Master API"
4. Add a description: "API endpoints for Course Master platform"

---

### 📝 Setting Up Environment Variables

Environment variables make it easy to switch between different environments (development, staging, production).

#### Create Environment

1. Click the **gear icon** (⚙️) in the top right
2. Click **"Add"** to create a new environment
3. Name it **"Course Master - Local"**
4. Add the following variables:

| Variable           | Initial Value           | Current Value               |
| ------------------ | ----------------------- | --------------------------- |
| `base_url`         | `http://localhost:5000` | `http://localhost:5000`     |
| `admin_email`      | `admin@test.com`        | `admin@test.com`            |
| `admin_password`   | `admin123`              | `admin123`                  |
| `student_email`    | `john@test.com`         | `john@test.com`             |
| `student_password` | `student123`            | `student123`                |
| `course_id`        |                         | (will be set automatically) |
| `assignment_id`    |                         | (will be set automatically) |
| `quiz_id`          |                         | (will be set automatically) |

5. Click **"Save"**
6. Select this environment from the dropdown in the top right

---

### 🔐 Authentication Setup

The API uses **HTTP-only cookies** for authentication. Postman automatically handles cookies.

#### Folder Structure

Create the following folder structure in your collection:

```
📁 Course Master API
  📁 Authentication
  📁 Courses
    📁 Public
    📁 Admin
  📁 Student Operations
  📁 Admin Operations
```

---

### 📂 Authentication Endpoints

#### 1. Register Student

- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "{{student_email}}",
    "password": "{{student_password}}",
    "role": "student"
  }
  ```
- **Tests (Scripts tab):**

  ```javascript
  pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
  });

  pm.test("Response has user data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("user");
    pm.expect(jsonData.user).to.have.property("email");
  });
  ```

#### 2. Register Admin

- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Admin User",
    "email": "{{admin_email}}",
    "password": "{{admin_password}}",
    "role": "admin"
  }
  ```

#### 3. Login Student

- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "{{student_email}}",
    "password": "{{student_password}}"
  }
  ```
- **Tests:**

  ```javascript
  pm.test("Login successful", function () {
    pm.response.to.have.status(200);
  });

  pm.test("Cookie is set", function () {
    pm.expect(pm.cookies.has("token")).to.be.true;
  });

  var jsonData = pm.response.json();
  pm.test("User role is student", function () {
    pm.expect(jsonData.user.role).to.eql("student");
  });
  ```

#### 4. Login Admin

- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "{{admin_email}}",
    "password": "{{admin_password}}"
  }
  ```

#### 5. Get Current User

- **Method:** `GET`
- **URL:** `{{base_url}}/api/auth/me`
- **Tests:**

  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });

  pm.test("User data returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("user");
  });
  ```

#### 6. Logout

- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/logout`
- **Tests:**
  ```javascript
  pm.test("Logout successful", function () {
    pm.response.to.have.status(200);
  });
  ```

---

### 📚 Course Endpoints

#### 1. Get All Courses (Public)

- **Method:** `GET`
- **URL:** `{{base_url}}/api/courses`
- **Query Params (optional):**
  | Key | Value | Description |
  |-----|-------|-------------|
  | `search` | `javascript` | Search term |
  | `category` | `programming` | Filter by category |
  | `page` | `1` | Page number |
  | `limit` | `10` | Items per page |
  | `sort` | `price_asc` | Sort order |

- **Tests:**

  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });

  pm.test("Response has data and meta", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("data");
    pm.expect(jsonData).to.have.property("meta");
  });
  ```

#### 2. Get Course by ID (Public)

- **Method:** `GET`
- **URL:** `{{base_url}}/api/courses/{{course_id}}`
- **Tests:**

  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });

  pm.test("Course has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.course).to.have.property("title");
    pm.expect(jsonData.course).to.have.property("syllabus");
    pm.expect(jsonData.course).to.have.property("batches");
  });
  ```

#### 3. Create Course (Admin Only)

**⚠️ Important:** Login as admin first!

- **Method:** `POST`
- **URL:** `{{base_url}}/api/courses/admin/create`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch with hands-on examples",
    "price": 49.99,
    "category": "programming",
    "tags": ["javascript", "web development", "beginner"],
    "syllabus": [
      {
        "lessonId": "lesson-1",
        "title": "Introduction to JavaScript",
        "duration": 30,
        "videoUrl": "https://example.com/videos/js-intro.mp4",
        "description": "Overview of JavaScript and its ecosystem"
      },
      {
        "lessonId": "lesson-2",
        "title": "Variables and Data Types",
        "duration": 45,
        "videoUrl": "https://example.com/videos/js-variables.mp4",
        "description": "Understanding variables, let, const, and data types"
      }
    ],
    "batches": [
      {
        "batchId": "batch-1",
        "startDate": "2024-03-01T00:00:00.000Z",
        "endDate": "2024-05-01T00:00:00.000Z",
        "capacity": 50
      }
    ]
  }
  ```
- **Tests:**

  ```javascript
  pm.test("Course created successfully", function () {
    pm.response.to.have.status(201);
  });

  var jsonData = pm.response.json();

  // Save course ID for later use
  if (jsonData.course && jsonData.course._id) {
    pm.environment.set("course_id", jsonData.course._id);
  }

  pm.test("Course ID saved to environment", function () {
    pm.expect(pm.environment.get("course_id")).to.not.be.undefined;
  });
  ```

#### 4. Update Course (Admin Only)

- **Method:** `PUT`
- **URL:** `{{base_url}}/api/courses/admin/{{course_id}}`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "JavaScript Fundamentals - Updated",
    "price": 59.99
  }
  ```

#### 5. Delete Course (Admin Only)

- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/courses/admin/{{course_id}}`

---

### 🎓 Student Operations

#### 1. Enroll in Course

**⚠️ Important:** Login as student first!

- **Method:** `POST`
- **URL:** `{{base_url}}/api/enroll`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "courseId": "{{course_id}}",
    "batchId": "batch-1"
  }
  ```
- **Tests:**

  ```javascript
  pm.test("Enrollment successful", function () {
    pm.response.to.have.status(201);
  });

  pm.test("Enrollment data returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("enrollment");
  });
  ```

#### 2. Get Student Courses

- **Method:** `GET`
- **URL:** `{{base_url}}/api/student/courses`
- **Tests:**

  ```javascript
  pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
  });

  pm.test("Courses array returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("courses");
    pm.expect(jsonData.courses).to.be.an("array");
  });
  ```

#### 3. Update Progress

- **Method:** `POST`
- **URL:** `{{base_url}}/api/progress`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "courseId": "{{course_id}}",
    "lessonId": "lesson-1"
  }
  ```
- **Tests:**

  ```javascript
  pm.test("Progress updated", function () {
    pm.response.to.have.status(200);
  });

  pm.test("Progress percentage calculated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.progress).to.have.property("percentage");
    pm.expect(jsonData.progress.percentage).to.be.a("number");
  });
  ```

#### 4. Submit Assignment

- **Method:** `POST`
- **URL:** `{{base_url}}/api/assignments`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "assignmentId": "{{assignment_id}}",
    "submissionText": "Here is my assignment solution. I implemented the required functionality using JavaScript ES6 features...",
    "submissionLink": "https://github.com/johndoe/assignment-repo"
  }
  ```

#### 5. Submit Quiz

- **Method:** `POST`
- **URL:** `{{base_url}}/api/quiz/submit`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "quizId": "{{quiz_id}}",
    "answers": [0, 2, 1, 3, 0],
    "timeTaken": 450
  }
  ```
- **Tests:**

  ```javascript
  pm.test("Quiz submitted successfully", function () {
    pm.response.to.have.status(200);
  });

  pm.test("Score calculated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.attempt).to.have.property("score");
    pm.expect(jsonData).to.have.property("passed");
  });
  ```

---

### 🔄 Testing Workflows in Postman

#### Complete Test Flow

Create a **Collection Runner** workflow:

1. Click on your collection → Click **"Run"**
2. Select the requests in this order:
   - Register Admin
   - Login Admin
   - Create Course
   - Register Student
   - Login Student
   - Get All Courses
   - Enroll in Course
   - Get Student Courses
   - Update Progress
   - Get Current User

3. Click **"Run Course Master API"**
4. View results with pass/fail status for each test

#### Using Pre-request Scripts

Add this to your **Collection's Pre-request Script** for automatic token refresh:

```javascript
// Check if we need to login
const currentTime = new Date().getTime();
const tokenExpiry = pm.environment.get("token_expiry");

if (!tokenExpiry || currentTime > tokenExpiry) {
  console.log("Token expired or not set, logging in...");
  // Token will be set via cookie automatically on login
}
```

---

### 🎯 Advanced Postman Features

#### 1. Collection-level Tests

Add to Collection → Tests tab:

```javascript
// Log response time
console.log("Response time:", pm.response.responseTime + "ms");

// Check response time is acceptable
pm.test("Response time is less than 2000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

#### 2. Dynamic Variables

Postman provides built-in dynamic variables:

```json
{
  "email": "user_{{$timestamp}}@test.com",
  "name": "{{$randomFullName}}",
  "courseTitle": "{{$randomJobTitle}} Course"
}
```

#### 3. Visualize Responses

Add to the **Tests** tab to create visualizations:

```javascript
var template = `
    <h2>Course Statistics</h2>
    <table>
        <tr><th>Total Courses</th><td>{{total}}</td></tr>
        <tr><th>Current Page</th><td>{{page}}</td></tr>
        <tr><th>Total Pages</th><td>{{totalPages}}</td></tr>
    </table>
`;

var jsonData = pm.response.json();
pm.visualizer.set(template, jsonData.meta);
```

---

### 📤 Export & Share Collection

#### Export Collection

1. Click **"..."** next to collection name
2. Select **"Export"**
3. Choose **Collection v2.1** format
4. Save as `course-master-api.postman_collection.json`

#### Export Environment

1. Click the **gear icon** (⚙️)
2. Click **"..."** next to your environment
3. Select **"Export"**
4. Save as `course-master-local.postman_environment.json`

#### Share with Team

Share the exported files with your team, or publish to Postman workspace.

---

### 🐛 Debugging Tips

#### 1. View Console

- Open **Postman Console** (View → Show Postman Console)
- See all requests, responses, and console.log outputs

#### 2. Inspect Cookies

- Click **"Cookies"** link below the Send button
- View all cookies for the domain
- Manually add/edit/delete cookies

#### 3. Check Request Details

- Click on a request in History
- View exact headers, body, and response
- Copy as cURL for command-line testing

#### 4. Common Issues

| Issue                 | Solution                               |
| --------------------- | -------------------------------------- |
| 401 Unauthorized      | Login first, ensure cookie is set      |
| 404 Not Found         | Check URL and course_id variable       |
| 500 Server Error      | Check server logs, verify request body |
| Cookie not persisting | Disable "Interceptor" in settings      |

---

## Base URL

```bash
BASE_URL="http://localhost:5000"
```

## 📋 Table of Contents

- [Postman API Testing Guide](#-postman-api-testing-guide)
- [cURL Testing Guide](#-curl-testing-guide)
  - [Authentication](#authentication)
  - [Courses](#courses)
  - [Student Operations](#student-operations)
  - [Testing Flow](#testing-flow)

---

## 📟 cURL Testing Guide

---

## Authentication

### 1. Register User (Student)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

**Expected Response:**

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

---

### 2. Register Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

---

### 3. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**

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

---

### 4. Login Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

---

### 5. Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

**Expected Response:**

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

---

### 6. Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

**Expected Response:**

```json
{
  "message": "Logged out successfully"
}
```

---

## Courses

### 1. Create Course (Admin Only)

```bash
curl -X POST http://localhost:5000/api/courses/admin/create \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch with hands-on examples",
    "price": 49.99,
    "category": "programming",
    "tags": ["javascript", "web development", "beginner"],
    "syllabus": [
      {
        "lessonId": "lesson-1",
        "title": "Introduction to JavaScript",
        "duration": 30,
        "videoUrl": "https://example.com/videos/js-intro.mp4",
        "description": "Overview of JavaScript and its ecosystem"
      },
      {
        "lessonId": "lesson-2",
        "title": "Variables and Data Types",
        "duration": 45,
        "videoUrl": "https://example.com/videos/js-variables.mp4",
        "description": "Understanding variables, let, const, and data types"
      },
      {
        "lessonId": "lesson-3",
        "title": "Functions and Scope",
        "duration": 50,
        "videoUrl": "https://example.com/videos/js-functions.mp4",
        "description": "Deep dive into functions and scope"
      }
    ],
    "batches": [
      {
        "batchId": "batch-1",
        "startDate": "2024-03-01T00:00:00.000Z",
        "endDate": "2024-05-01T00:00:00.000Z",
        "capacity": 50
      }
    ]
  }'
```

**Save the course ID from response for later use:**

```bash
# Extract and save course ID
COURSE_ID="<paste_course_id_here>"
```

---

### 2. Get All Courses (Public)

```bash
curl -X GET http://localhost:5000/api/courses
```

**With filters and pagination:**

```bash
curl -X GET "http://localhost:5000/api/courses?search=javascript&category=programming&page=1&limit=10&sort=price_asc"
```

**Expected Response:**

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
      "enrollmentCount": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Get Course by ID (Public)

```bash
curl -X GET http://localhost:5000/api/courses/$COURSE_ID
```

**Or with actual ID:**

```bash
curl -X GET http://localhost:5000/api/courses/507f1f77bcf86cd799439011
```

---

### 4. Update Course (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/courses/admin/$COURSE_ID \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "title": "JavaScript Fundamentals - Updated",
    "price": 59.99
  }'
```

---

### 5. Delete Course (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/courses/admin/$COURSE_ID \
  -b admin-cookies.txt
```

---

## Student Operations

### 1. Enroll in Course

```bash
curl -X POST http://localhost:5000/api/enroll \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "courseId": "'"$COURSE_ID"'",
    "batchId": "batch-1"
  }'
```

**Expected Response:**

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

---

### 2. Get Student Courses

```bash
curl -X GET http://localhost:5000/api/student/courses \
  -b cookies.txt
```

**Expected Response:**

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
        "enrollmentCount": 1
      },
      "studentId": "507f1f77bcf86cd799439015",
      "batchId": "batch-1",
      "enrolledAt": "2024-01-20T10:30:00.000Z",
      "status": "active",
      "progress": {
        "_id": "507f1f77bcf86cd799439016",
        "studentId": "507f1f77bcf86cd799439015",
        "courseId": "507f1f77bcf86cd799439011",
        "lessonsCompleted": 0,
        "totalLessons": 3,
        "percentage": 0,
        "completedLessonIds": []
      }
    }
  ]
}
```

---

### 3. Update Progress

```bash
curl -X POST http://localhost:5000/api/progress \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "courseId": "'"$COURSE_ID"'",
    "lessonId": "lesson-1"
  }'
```

**Mark another lesson complete:**

```bash
curl -X POST http://localhost:5000/api/progress \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "courseId": "'"$COURSE_ID"'",
    "lessonId": "lesson-2"
  }'
```

**Expected Response:**

```json
{
  "message": "Progress updated",
  "progress": {
    "_id": "507f1f77bcf86cd799439016",
    "studentId": "507f1f77bcf86cd799439015",
    "courseId": "507f1f77bcf86cd799439011",
    "lessonsCompleted": 2,
    "totalLessons": 3,
    "percentage": 67,
    "completedLessonIds": ["lesson-1", "lesson-2"],
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

---

### 4. Submit Assignment

**With submission text:**

```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "assignmentId": "507f1f77bcf86cd799439017",
    "submissionText": "Here is my assignment solution. I implemented the required functionality using JavaScript ES6 features..."
  }'
```

**With submission link:**

```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "assignmentId": "507f1f77bcf86cd799439017",
    "submissionLink": "https://github.com/johndoe/assignment-repo"
  }'
```

**With both:**

```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "assignmentId": "507f1f77bcf86cd799439017",
    "submissionText": "Please check my GitHub repository for the complete solution.",
    "submissionLink": "https://github.com/johndoe/assignment-repo"
  }'
```

**Expected Response:**

```json
{
  "message": "Assignment submitted successfully",
  "submission": {
    "studentId": "507f1f77bcf86cd799439015",
    "submissionText": "Here is my assignment solution...",
    "submissionLink": "https://github.com/johndoe/assignment-repo",
    "submittedAt": "2024-01-20T12:00:00.000Z"
  }
}
```

---

### 5. Submit Quiz

```bash
curl -X POST http://localhost:5000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "quizId": "507f1f77bcf86cd799439018",
    "answers": [0, 2, 1, 3, 0],
    "timeTaken": 450
  }'
```

**Expected Response:**

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

## Testing Flow

### Complete Test Scenario

Here's a complete flow to test the entire API:

```bash
#!/bin/bash

# Base URL
BASE_URL="http://localhost:5000"

echo "=== 1. Register Admin ==="
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }'

echo -e "\n\n=== 2. Login Admin ==="
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'

echo -e "\n\n=== 3. Create Course ==="
COURSE_RESPONSE=$(curl -X POST $BASE_URL/api/courses/admin/create \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch",
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
        "startDate": "2024-03-01T00:00:00.000Z",
        "endDate": "2024-05-01T00:00:00.000Z",
        "capacity": 50
      }
    ]
  }')

echo $COURSE_RESPONSE

# Extract course ID (requires jq)
# COURSE_ID=$(echo $COURSE_RESPONSE | jq -r '.course._id')

echo -e "\n\n=== 4. Register Student ==="
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -c student-cookies.txt \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "student123",
    "role": "student"
  }'

echo -e "\n\n=== 5. Login Student ==="
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -c student-cookies.txt \
  -d '{
    "email": "john@test.com",
    "password": "student123"
  }'

echo -e "\n\n=== 6. Get All Courses ==="
curl -X GET $BASE_URL/api/courses

echo -e "\n\n=== 7. Enroll in Course ==="
# Replace COURSE_ID with actual ID from step 3
curl -X POST $BASE_URL/api/enroll \
  -H "Content-Type: application/json" \
  -b student-cookies.txt \
  -d '{
    "courseId": "COURSE_ID_HERE",
    "batchId": "batch-1"
  }'

echo -e "\n\n=== 8. Get Student Courses ==="
curl -X GET $BASE_URL/api/student/courses \
  -b student-cookies.txt

echo -e "\n\n=== 9. Update Progress ==="
curl -X POST $BASE_URL/api/progress \
  -H "Content-Type: application/json" \
  -b student-cookies.txt \
  -d '{
    "courseId": "COURSE_ID_HERE",
    "lessonId": "lesson-1"
  }'

echo -e "\n\n=== 10. Get Current User ==="
curl -X GET $BASE_URL/api/auth/me \
  -b student-cookies.txt

echo -e "\n\n=== Tests Complete ==="
```

---

## Tips & Tricks

### 1. Pretty Print JSON Response

Use `jq` for formatted output:

```bash
curl -X GET http://localhost:5000/api/courses | jq
```

### 2. Save Response to File

```bash
curl -X GET http://localhost:5000/api/courses > courses.json
```

### 3. Show Response Headers

```bash
curl -i -X GET http://localhost:5000/api/courses
```

### 4. Verbose Output (Debug)

```bash
curl -v -X GET http://localhost:5000/api/courses
```

### 5. Set Timeout

```bash
curl --max-time 10 -X GET http://localhost:5000/api/courses
```

### 6. Follow Redirects

```bash
curl -L -X GET http://localhost:5000/api/courses
```

---

## Cookie Management

### Save Cookies

```bash
# -c saves cookies to file
curl -c cookies.txt -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Use Saved Cookies

```bash
# -b uses cookies from file
curl -b cookies.txt -X GET http://localhost:5000/api/auth/me
```

### View Cookies

```bash
cat cookies.txt
```

### Clear Cookies

```bash
rm cookies.txt admin-cookies.txt student-cookies.txt
```

---

## Error Testing

### Test Invalid Credentials

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpassword"
  }'
```

### Test Unauthorized Access

```bash
curl -X POST http://localhost:5000/api/courses/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Course",
    "description": "This should fail",
    "price": 99.99,
    "category": "test"
  }'
```

### Test Validation Errors

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "email": "invalid-email",
    "password": "123"
  }'
```

---

## Environment Variables

For easier testing, set these in your terminal:

```bash
export BASE_URL="http://localhost:5000"
export ADMIN_EMAIL="admin@test.com"
export ADMIN_PASSWORD="admin123"
export STUDENT_EMAIL="john@test.com"
export STUDENT_PASSWORD="student123"
```

Then use them in commands:

```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "'"$STUDENT_EMAIL"'",
    "password": "'"$STUDENT_PASSWORD"'"
  }'
```

---

## Quick Reference

| Endpoint                    | Method | Auth Required | Role    |
| --------------------------- | ------ | ------------- | ------- |
| `/api/auth/register`        | POST   | No            | -       |
| `/api/auth/login`           | POST   | No            | -       |
| `/api/auth/logout`          | POST   | No            | -       |
| `/api/auth/me`              | GET    | Yes           | Any     |
| `/api/courses`              | GET    | No            | -       |
| `/api/courses/:id`          | GET    | No            | -       |
| `/api/courses/admin/create` | POST   | Yes           | Admin   |
| `/api/courses/admin/:id`    | PUT    | Yes           | Admin   |
| `/api/courses/admin/:id`    | DELETE | Yes           | Admin   |
| `/api/enroll`               | POST   | Yes           | Student |
| `/api/student/courses`      | GET    | Yes           | Student |
| `/api/progress`             | POST   | Yes           | Student |
| `/api/assignments`          | POST   | Yes           | Student |
| `/api/quiz/submit`          | POST   | Yes           | Student |

---

**Happy Testing! 🚀**
