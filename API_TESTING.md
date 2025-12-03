# Course Master API - cURL Testing Guide

Complete cURL commands for testing all API endpoints in the terminal.

## Base URL

```bash
BASE_URL="http://localhost:5000"
```

## 📋 Table of Contents

- [Authentication](#authentication)
- [Courses](#courses)
- [Student Operations](#student-operations)
- [Testing Flow](#testing-flow)

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
