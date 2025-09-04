# Watoto LMS System Architecture

## Overview

The Watoto LMS (Learning Management System) is designed as a modern, scalable web application following microservices principles and best practices from the system-design-primer repository. The architecture supports horizontal scaling, high availability, and maintains security as a first-class concern.

## System Context

### Business Context
- **Target Users**: Students (Grades 7-9), Teachers, Administrators
- **Use Cases**: Course management, progress tracking, assessments, content delivery
- **Scale**: From 100 to 10,000+ concurrent users
- **Compliance**: GDPR, FERPA, accessibility standards

### Technical Context
- **Deployment**: Cloud-native with containerization
- **Scalability**: Horizontal scaling with load balancing
- **Reliability**: 99.9% uptime with automated failover
- **Security**: Defense-in-depth with multiple security layers

## Architecture Principles

### 1. Separation of Concerns
- **Frontend**: User interface and client-side logic
- **Backend**: Business logic and API services
- **Database**: Data persistence and retrieval
- **Infrastructure**: Deployment and scaling

### 2. Scalability Patterns
- **Horizontal Scaling**: Add more servers as load increases
- **Load Balancing**: Distribute traffic across multiple instances
- **Caching**: Multi-level caching strategy
- **Asynchronous Processing**: Background job processing

### 3. Reliability Patterns
- **Fail-over**: Automatic switching to backup systems
- **Circuit Breaker**: Prevent cascade failures
- **Health Checks**: Continuous system monitoring
- **Graceful Degradation**: Maintain functionality during failures

### 4. Security Principles
- **Defense in Depth**: Multiple security layers
- **Zero Trust**: Verify all access requests
- **Least Privilege**: Minimum required permissions
- **Secure by Default**: Security features enabled by default

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Web Browser   │  │   Mobile App    │  │   Desktop   │  │
│  │   (React SPA)   │  │   (React Native)│  │   App       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 Edge Layer (CDN & Security)                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   CloudFlare    │  │   AWS CloudFront │  │   Fastly   │  │
│  │   CDN & WAF     │  │   CDN & Shield  │  │   CDN       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 API Gateway Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Nginx         │  │   Kong Gateway  │  │   AWS API  │  │
│  │   (Reverse      │  │   (API Gateway) │  │   Gateway   │  │
│  │    Proxy)       │  │                 │  │             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Web Server    │  │   API Server    │  │   Worker    │  │
│  │   (Nginx)       │  │   (Flask/FastAPI│  │   Server    │  │
│  └─────────────────┘  │   /Express)     │  │   (Celery)  │  │
│                       └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 Data Layer                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   PostgreSQL    │  │   Redis Cache   │  │   Message   │  │
│  │   (Primary DB)  │  │   (Sessions)    │  │   Queue     │  │
│  └─────────────────┘  └─────────────────┘  │   (RabbitMQ)│  │
│                                            └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   Docker        │  │   Kubernetes    │  │   AWS ECS   │  │
│  │   Containers    │  │   Orchestration │  │   (Fargate) │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Client Layer

#### Web Application (React SPA)
```javascript
// src/index.js - Application Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import App from './App';
import theme from './theme';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
```

#### Progressive Web App (PWA) Features
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: Installable PWA
- **Push Notifications**: Real-time updates
- **Background Sync**: Offline data synchronization

### 2. Edge Layer

#### Content Delivery Network (CDN)
```javascript
// CDN Configuration
const CDN_CONFIG = {
  // Primary CDN
  primary: 'https://cdn.watoto-lms.com',

  // CDN regions
  regions: {
    'us-east': 'https://us-east.cdn.watoto-lms.com',
    'eu-west': 'https://eu-west.cdn.watoto-lms.com',
    'asia-pacific': 'https://asia.cdn.watoto-lms.com'
  },

  // Cache settings
  cache: {
    staticAssets: 31536000,  // 1 year
    apiResponses: 300,       // 5 minutes
    userContent: 3600        // 1 hour
  }
};
```

#### Web Application Firewall (WAF)
- **Rate Limiting**: Prevent DDoS attacks
- **SQL Injection Prevention**: Block malicious SQL
- **XSS Protection**: Filter cross-site scripting
- **Bot Detection**: Identify and block malicious bots

### 3. API Gateway Layer

#### Request Routing
```nginx
# /etc/nginx/sites-available/watoto-lms
server {
    listen 80;
    server_name api.watoto-lms.com;

    # Rate limiting
    limit_req zone=api burst=10 nodelay;

    # API routing
    location /api/v1/ {
        # Authentication check
        auth_request /auth/verify;

        # Route to backend
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static file serving
    location /static/ {
        proxy_pass http://static_servers;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### API Gateway Features
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Rate Limiting**: Per-user and per-endpoint limits
- **Request Transformation**: API versioning and format conversion
- **Response Caching**: Cache API responses
- **Logging**: Comprehensive API logging

### 4. Application Layer

#### Microservices Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │ Course Service  │    │  Assessment    │
│                 │    │                 │    │   Service      │
│ • Registration  │    │ • CRUD          │    │               │
│ • Authentication│    │ • Enrollment    │    │ • Quiz Engine  │
│ • Profile Mgmt  │    │ • Progress      │    │ • Grading      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Notification    │    │ Analytics       │    │  File Upload   │
│   Service       │    │   Service       │    │   Service      │
│                 │    │                 │    │               │
│ • Email         │    │ • Reports       │    │ • Image Proc   │
│ • Push          │    │ • Metrics       │    │ • Video Proc   │
│ • SMS           │    │ • Dashboards    │    │ • Storage      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Service Communication
```python
# backend/services/communication.py
from flask import Flask
import requests
from tenacity import retry, stop_after_attempt, wait_exponential

app = Flask(__name__)

class ServiceClient:
    def __init__(self, service_name, base_url):
        self.service_name = service_name
        self.base_url = base_url
        self.session = requests.Session()

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def call_service(self, endpoint, method='GET', data=None, headers=None):
        """Call another microservice with retry logic"""
        url = f"{self.base_url}{endpoint}"

        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            app.logger.error(f"Service call failed: {self.service_name} - {e}")
            raise

# Service clients
user_service = ServiceClient('user-service', 'http://user-service:8000')
course_service = ServiceClient('course-service', 'http://course-service:8001')
notification_service = ServiceClient('notification-service', 'http://notification-service:8002')
```

### 5. Data Layer

#### Database Schema Design
```sql
-- Core tables with relationships
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    grade INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructor_id INTEGER REFERENCES users(id),
    grade INTEGER NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_active ON users(role, is_active);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_progress ON enrollments(progress_percentage);
```

#### Caching Strategy
```python
# backend/cache/strategy.py
from redis import Redis
from flask_caching import Cache
import json

class CacheManager:
    def __init__(self):
        self.redis = Redis(host='localhost', port=6379, db=0)
        self.app_cache = Cache(config={'CACHE_TYPE': 'redis'})

    def get_user_profile(self, user_id):
        """Get user profile with caching"""
        cache_key = f'user:profile:{user_id}'

        # Try Redis cache first
        cached_data = self.redis.get(cache_key)
        if cached_data:
            return json.loads(cached_data)

        # Fetch from database
        user_data = self._fetch_user_from_db(user_id)
        if user_data:
            # Cache for 1 hour
            self.redis.setex(cache_key, 3600, json.dumps(user_data))

        return user_data

    def invalidate_user_cache(self, user_id):
        """Invalidate user-related cache"""
        keys_to_delete = [
            f'user:profile:{user_id}',
            f'user:courses:{user_id}',
            f'user:progress:{user_id}'
        ]

        # Also delete pattern-based keys
        pattern_keys = self.redis.keys(f'user:*:{user_id}')
        keys_to_delete.extend(pattern_keys)

        if keys_to_delete:
            self.redis.delete(*keys_to_delete)
```

### 6. Infrastructure Layer

#### Containerization
```dockerfile
# Dockerfile for backend service
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["python", "app.py"]
```

#### Orchestration
```yaml
# docker-compose.yml for development
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: watoto_lms
      POSTGRES_USER: watoto_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U watoto_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://watoto_user:secure_password@db:5432/watoto_lms
      - REDIS_URL=redis://redis:6379/0
      - FLASK_ENV=development
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

## Data Flow Architecture

### User Registration Flow
```
1. User submits registration form (Frontend)
2. Frontend validates input and sends to API
3. API Gateway validates request and routes to User Service
4. User Service validates data and creates user in database
5. User Service sends welcome email via Notification Service
6. User Service caches user data in Redis
7. API Gateway returns success response
8. Frontend redirects to dashboard
```

### Course Enrollment Flow
```
1. Student clicks enroll button (Frontend)
2. Frontend sends enrollment request to API
3. API Gateway authenticates user and routes to Course Service
4. Course Service validates enrollment eligibility
5. Course Service creates enrollment record in database
6. Course Service updates course statistics
7. Course Service invalidates relevant caches
8. Course Service sends notification via Notification Service
9. API Gateway returns enrollment confirmation
10. Frontend updates UI to show enrolled status
```

### Content Delivery Flow
```
1. Student requests course content (Frontend)
2. Frontend checks browser cache first
3. If not cached, requests from CDN
4. CDN serves cached content or fetches from origin
5. Origin server (Nginx) serves static files or proxies to API
6. API retrieves content from database or cache
7. Content is delivered with appropriate cache headers
8. Frontend renders content and caches locally
```

## Security Architecture

### Authentication & Authorization
```python
# backend/security/auth.py
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from functools import wraps
from werkzeug.security import check_password_hash

jwt = JWTManager(app)

def role_required(required_role):
    """Decorator for role-based access control"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user = get_jwt_identity()
            user_role = get_user_role(current_user)

            if user_role not in required_role:
                return jsonify({'error': 'Insufficient permissions'}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Usage
@app.route('/api/admin/users', methods=['GET'])
@role_required(['admin'])
def get_all_users():
    # Only admins can access this endpoint
    pass
```

### Input Validation & Sanitization
```python
# backend/security/validation.py
from cerberus import Validator
import bleach

class InputValidator:
    def __init__(self):
        self.user_schema = {
            'email': {'type': 'string', 'regex': r'^[^\s@]+@[^\s@]+\.[^\s@]+$'},
            'first_name': {'type': 'string', 'minlength': 1, 'maxlength': 50},
            'last_name': {'type': 'string', 'minlength': 1, 'maxlength': 50},
            'password': {'type': 'string', 'minlength': 8}
        }

    def validate_user_input(self, data):
        """Validate user input against schema"""
        validator = Validator(self.user_schema)
        return validator.validate(data), validator.errors

    def sanitize_html(self, content):
        """Sanitize HTML content"""
        allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3']
        allowed_attrs = {}
        return bleach.clean(content, tags=allowed_tags, attributes=allowed_attrs)

# Usage
validator = InputValidator()

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()

    is_valid, errors = validator.validate_user_input(data)
    if not is_valid:
        return jsonify({'errors': errors}), 400

    # Sanitize any HTML content
    if 'bio' in data:
        data['bio'] = validator.sanitize_html(data['bio'])

    # Continue with user creation
    return create_user_logic(data)
```

## Performance Architecture

### Caching Layers
```
┌─────────────────┐
│   Browser Cache │  (Static assets, 1 year)
└─────────────────┘
          │
          ▼
┌─────────────────┐
│     CDN Cache   │  (Global distribution, 24 hours)
└─────────────────┘
          │
          ▼
┌─────────────────┐
│  Application    │  (API responses, 5 minutes)
│     Cache       │
└─────────────────┘
          │
          ▼
┌─────────────────┐
│  Database Cache │  (Query results, 1 hour)
└─────────────────┘
```

### Database Optimization
```sql
-- Optimized indexes
CREATE INDEX CONCURRENTLY idx_enrollments_composite
ON enrollments(student_id, course_id, progress_percentage DESC);

-- Partial indexes for active data
CREATE INDEX CONCURRENTLY idx_active_courses
ON courses(grade, category) WHERE is_active = true;

-- Covering indexes
CREATE INDEX CONCURRENTLY idx_user_enrollments_covering
ON enrollments(student_id, course_id, enrolled_at, progress_percentage)
INCLUDE (status);
```

## Monitoring Architecture

### Observability Stack
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Infrastructure │    │   Business      │
│   Metrics       │    │   Metrics        │    │   Metrics       │
│                 │    │                  │    │                 │
│ • Response time │    │ • CPU usage      │    │ • User activity │
│ • Error rate    │    │ • Memory usage   │    │ • Course        │
│ • Throughput    │    │ • Disk I/O       │    │   completion    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Prometheus    │    │   Grafana        │    │   AlertManager  │
│   (Collection)  │    │   (Visualization)│    │   (Alerts)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Logging Architecture
```python
# backend/logging/config.py
import logging
from logging.handlers import RotatingFileHandler
import json
from datetime import datetime

class StructuredLogger:
    def __init__(self):
        self.logger = logging.getLogger('watoto_lms')
        self.logger.setLevel(logging.INFO)

        # JSON formatter for structured logging
        formatter = logging.Formatter(
            json.dumps({
                'timestamp': '%(asctime)s',
                'level': '%(levelname)s',
                'service': 'backend',
                'message': '%(message)s',
                'extra': '%(extra)s'
            })
        )

        # File handler with rotation
        file_handler = RotatingFileHandler(
            '/var/log/watoto-lms/app.log',
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

    def log_request(self, method, endpoint, status_code, duration, user_id=None):
        """Log API request"""
        self.logger.info('API Request', extra={
            'method': method,
            'endpoint': endpoint,
            'status_code': status_code,
            'duration_ms': duration,
            'user_id': user_id,
            'timestamp': datetime.utcnow().isoformat()
        })

    def log_error(self, error_type, message, stack_trace=None, user_id=None):
        """Log application error"""
        self.logger.error('Application Error', extra={
            'error_type': error_type,
            'message': message,
            'stack_trace': stack_trace,
            'user_id': user_id,
            'timestamp': datetime.utcnow().isoformat()
        })

# Usage
logger = StructuredLogger()

@app.after_request
def log_request_info(response):
    duration = time.time() - g.start_time
    user_id = getattr(g, 'user_id', None)

    logger.log_request(
        request.method,
        request.path,
        response.status_code,
        duration * 1000,  # Convert to milliseconds
        user_id
    )

    return response
```

## Deployment Architecture

### Blue-Green Deployment
```
┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Load Balancer │
│                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │
│  │  Blue     │  │    │  │  Green    │  │
│  │ (v1.0.0)  │  │    │  │ (v1.1.0)  │  │
│  └───────────┘  │    │  └───────────┘  │
│                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │
│  │ Database  │  │    │  │ Database  │  │
│  │ (Shared)  │  │    │  │ (Shared)  │  │
│  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘
```

### Canary Deployment
```
┌─────────────────┐
│   Load Balancer │
│                 │
│  ┌───────────┐  │  95% traffic
│  │  Stable   │◄─┼─────────────┐
│  │ (v1.0.0)  │  │             │
│  └───────────┘  │             │
│                 │             │
│  ┌───────────┐  │  5% traffic │
│  │  Canary   │◄─┼─────────────┘
│  │ (v1.1.0)  │  │
│  └───────────┘  │
└─────────────────┘
```

## Disaster Recovery Architecture

### Multi-Region Deployment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Region 1      │    │   Region 2      │    │   Region 3      │
│   (Primary)     │    │   (Secondary)   │    │   (DR)          │
│                 │    │                 │    │                 │
│ • App Servers   │    │ • App Servers   │    │ • App Servers   │
│ • Database      │    │ • Read Replicas │    │ • Read Replicas │
│ • CDN Edge      │    │ • CDN Edge      │    │ • CDN Edge      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                    ┌─────────────────┐
                    │   Global Load   │
                    │   Balancer      │
                    └─────────────────┘
```

### Backup Strategy
```bash
# /opt/watoto-lms/scripts/backup.sh
#!/bin/bash

BACKUP_DIR="/opt/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump -U watoto_user -h primary-db watoto_lms > "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Application configuration
tar -czf "$BACKUP_DIR/config_$TIMESTAMP.tar.gz" /opt/watoto-lms/config

# User uploaded files
aws s3 sync s3://watoto-uploads "$BACKUP_DIR/uploads_$TIMESTAMP/" --delete

# Encrypt backup
gpg --encrypt --recipient backup@watoto-lms.com "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Upload to secondary region
aws s3 cp "$BACKUP_DIR/" s3://watoto-backups-$REGION/ --recursive

# Clean old backups
find "$BACKUP_DIR" -name "*.sql" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete
```

This architecture provides a solid foundation for a scalable, secure, and maintainable LMS that can grow with the organization's needs while maintaining high performance and reliability.