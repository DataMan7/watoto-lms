# Watoto LMS API Documentation

## Overview

The Watoto LMS API is designed following RESTful principles with comprehensive error handling, authentication, and rate limiting. The API supports JSON data format and uses standard HTTP status codes.

## Base URL
```
https://api.watoto-lms.com/v1
```

## Authentication

All API requests require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Authentication Endpoints

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "student@school.edu",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@school.edu",
    "role": "student",
    "grade": 8
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

#### POST /auth/logout
Logout and invalidate tokens.

## Rate Limiting

- **Authenticated Users**: 1000 requests per hour
- **Unauthenticated Users**: 100 requests per hour
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Courses API

### GET /courses
Get list of courses with filtering and pagination.

**Query Parameters:**
- `grade` (integer): Filter by grade level (7, 8, 9)
- `category` (string): Filter by category (arts, music, programming)
- `search` (string): Search in course titles and descriptions
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20)

**Response:**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "Python Programming & Music Creation",
      "description": "Learn Python programming visually with blocks",
      "instructor": "Dr. Emily Chen",
      "grade": 7,
      "category": "programming",
      "students_count": 35,
      "created_at": "2024-09-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### GET /courses/{id}
Get detailed course information.

**Response:**
```json
{
  "id": 1,
  "title": "Python Programming & Music Creation",
  "description": "Learn Python programming visually with blocks while creating music and art",
  "instructor": "Dr. Emily Chen",
  "grade": 7,
  "category": "programming",
  "students_count": 35,
  "curriculum": {
    "duration": "3 months (Sept-Nov)",
    "methodology": "Block-Based Coding → Text Transition",
    "tools": ["EduBlocks", "Visual Python Editor", "Turtle Graphics"],
    "weeklyModules": [
      "Week 1-2: EduBlocks Setup & Visual Programming Basics",
      "Week 3-4: Block-Based Variables & Simple Music Notes"
    ],
    "finalProject": "Create an original musical composition using both blocks and simple Python code",
    "skills": ["Visual programming", "Python basics", "Music creation"]
  },
  "created_at": "2024-09-01T00:00:00Z"
}
```

### POST /courses
Create a new course (Teachers and Admins only).

**Request:**
```json
{
  "title": "Advanced Digital Art",
  "description": "Master advanced digital art techniques",
  "grade": 9,
  "category": "arts",
  "curriculum": {
    "duration": "3 months",
    "methodology": "Project-Based Learning",
    "tools": ["Adobe Creative Suite", "Digital Tablets"],
    "weeklyModules": ["Week 1: Digital Drawing Basics"],
    "finalProject": "Create a digital art portfolio",
    "skills": ["Digital art", "Design principles", "Creative tools"]
  }
}
```

### PUT /courses/{id}
Update course information (Teachers and Admins only).

### DELETE /courses/{id}
Delete a course (Admins only).

## Enrollment API

### GET /enrollments
Get user's course enrollments.

**Response:**
```json
{
  "enrollments": [
    {
      "id": 1,
      "course": {
        "id": 1,
        "title": "Python Programming & Music Creation",
        "grade": 7,
        "category": "programming"
      },
      "enrolled_at": "2024-09-01T00:00:00Z",
      "progress_percentage": 75,
      "status": "In Progress"
    }
  ]
}
```

### POST /enrollments
Enroll in a course.

**Request:**
```json
{
  "course_id": 1
}
```

### PUT /enrollments/{id}/progress
Update learning progress.

**Request:**
```json
{
  "progress_percentage": 80
}
```

## Users API

### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "id": 1,
  "email": "student@school.edu",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "grade": 8,
  "enrolled_courses": 5,
  "completed_courses": 2
}
```

### PUT /users/profile
Update user profile.

### GET /users/{id}
Get user information (Teachers and Admins only).

## Analytics API

### GET /analytics/courses
Get course analytics (Teachers and Admins only).

**Response:**
```json
{
  "total_courses": 10,
  "total_students": 245,
  "average_completion": 68.5,
  "popular_categories": [
    {"name": "programming", "count": 4},
    {"name": "music", "count": 3},
    {"name": "arts", "count": 3}
  ]
}
```

### GET /analytics/students/{id}
Get student progress analytics.

## Error Handling

All API errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

## WebSocket API

Real-time features use WebSocket connections.

### Connection
```
ws://api.watoto-lms.com/v1/ws?token=<jwt_token>
```

### Events

#### Course Updates
```json
{
  "type": "course_updated",
  "data": {
    "course_id": 1,
    "title": "Updated Course Title"
  }
}
```

#### Progress Updates
```json
{
  "type": "progress_updated",
  "data": {
    "enrollment_id": 1,
    "progress_percentage": 85
  }
}
```

## File Upload API

### POST /upload
Upload files (images, documents, videos).

**Supported Formats:**
- Images: JPG, PNG, GIF (max 5MB)
- Documents: PDF, DOC, DOCX (max 10MB)
- Videos: MP4, AVI (max 100MB)

**Response:**
```json
{
  "file_id": "abc123",
  "filename": "assignment.pdf",
  "url": "https://cdn.watoto-lms.com/files/abc123.pdf",
  "size": 2048576
}
```

## SDKs and Libraries

### JavaScript SDK
```javascript
import { WatotoLMS } from 'watoto-lms-sdk';

const client = new WatotoLMS({
  apiKey: 'your-api-key',
  baseURL: 'https://api.watoto-lms.com/v1'
});

// Get courses
const courses = await client.courses.list({ grade: 8 });

// Enroll in course
await client.enrollments.create({ course_id: 1 });
```

### Python SDK
```python
from watoto_lms import WatotoLMS

client = WatotoLMS(api_key='your-api-key')

# Get courses
courses = client.courses.list(grade=8)

# Update progress
client.enrollments.update_progress(1, 75)
```

## Versioning

API versioning follows semantic versioning:
- `v1`: Current stable version
- Breaking changes will introduce new major versions
- Deprecation notices provided 6 months before removal

## Support

For API support:
- **Documentation**: https://docs.watoto-lms.com
- **Status Page**: https://status.watoto-lms.com
- **Support Email**: api-support@watoto-lms.com