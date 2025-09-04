# Watoto LMS Backend API

A comprehensive backend API for the Watoto Learning Management System built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access
- **Course Management** - Full CRUD operations for courses and modules
- **Assessment System** - Create and manage quizzes with automatic grading
- **Progress Tracking** - Monitor student progress and completion rates
- **Certificate Generation** - Automated certificate creation and delivery
- **File Upload** - Support for course materials and user avatars
- **Email Notifications** - Automated emails for important events
- **Security Features** - Rate limiting, input validation, CORS protection

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Storage**: Cloudinary (for images/files)
- **Email**: Nodemailer
- **Validation**: Express Validator

## 📁 Project Structure

```
backend/
├── models/           # Database models
│   ├── User.js      # User model with authentication
│   ├── Course.js    # Course and module models
│   ├── Assessment.js # Quiz and test models
│   ├── Certificate.js # Certificate model
│   └── Progress.js   # Student progress tracking
├── routes/           # API route handlers
│   ├── auth.js      # Authentication routes
│   ├── users.js     # User management
│   ├── courses.js   # Course CRUD operations
│   ├── assessments.js # Assessment management
│   ├── progress.js   # Progress tracking
│   └── certificates.js # Certificate generation
├── middleware/       # Custom middleware
│   ├── auth.js      # JWT authentication middleware
│   ├── validation.js # Input validation
│   └── upload.js    # File upload handling
├── config/           # Configuration files
│   ├── database.js  # Database connection
│   ├── cloudinary.js # File storage config
│   └── email.js     # Email service config
├── utils/            # Utility functions
│   ├── jwt.js       # JWT token utilities
│   ├── pdf.js       # PDF generation
│   └── emailTemplates.js # Email templates
├── tests/            # Test files
└── server.js         # Main application file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd watoto-lms-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Configuration
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/watoto-lms

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Running the Application
```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login user with email and password.
```json
{
  "email": "student@watoto.edu",
  "password": "password123",
  "role": "student"
}
```

#### POST /api/auth/register
Register a new user account.
```json
{
  "email": "newstudent@watoto.edu",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "grade": 7
}
```

### Course Endpoints

#### GET /api/courses
Get all published courses with filtering options.

#### GET /api/courses/:id
Get detailed course information including modules.

#### POST /api/courses/:id/enroll
Enroll student in a course.

#### PUT /api/courses/:id/progress
Update student progress in a course.

### Assessment Endpoints

#### GET /api/assessments/:courseId
Get assessment for a specific course.

#### POST /api/assessments/:courseId/submit
Submit assessment answers for grading.

#### GET /api/assessments/:courseId/results
Get assessment results and feedback.

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: Enum ['student', 'teacher', 'parent', 'admin'],
  grade: Number (7-9, required for students),
  enrolledCourses: Array,
  certificates: Array,
  isActive: Boolean
}
```

### Course Model
```javascript
{
  title: String (required),
  description: String (required),
  instructor: ObjectId (ref: User),
  category: String (required),
  grade: Number (7-9, required),
  modules: Array,
  assessment: Object,
  duration: String,
  isPublished: Boolean,
  enrollmentCount: Number
}
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevents brute force attacks
- **Input Validation** - Comprehensive validation with express-validator
- **CORS Protection** - Configured for frontend domain
- **Helmet Security** - Security headers middleware
- **File Upload Security** - Type and size validation

## 📧 Email Notifications

The system sends automated emails for:
- Welcome messages for new users
- Course enrollment confirmations
- Assessment completion notifications
- Certificate issuance
- Password reset requests

## 📊 Monitoring & Analytics

- User activity tracking
- Course completion rates
- Assessment performance metrics
- System health monitoring
- Error logging and reporting

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB database (local or cloud)
2. Configure environment variables
3. Set up file storage (Cloudinary)
4. Configure email service
5. Set up SSL certificates for HTTPS

### Production Deployment
```bash
# Build and start
npm run build
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start server.js --name "watoto-lms-backend"
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run tests with coverage
npm run test:coverage
```

## 📈 Scaling Considerations

- **Database Indexing** - Optimized queries for large datasets
- **Caching** - Redis for session and data caching
- **File Storage** - CDN integration for media files
- **Load Balancing** - Multiple server instances
- **API Rate Limiting** - Prevent abuse and ensure fair usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Watoto Learning Community**