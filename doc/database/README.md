# Watoto LMS Database Design

## Overview

The Watoto LMS uses PostgreSQL as the primary database with Redis for caching. The database design follows normalization principles while optimizing for read-heavy workloads typical of LMS systems.

## Database Architecture

### Primary Database: PostgreSQL
- **Version**: PostgreSQL 15+
- **Character Set**: UTF-8
- **Collation**: en_US.UTF-8

### Caching Layer: Redis
- **Version**: Redis 7+
- **Use Cases**: Session storage, API response caching, rate limiting

### Read Replicas
- **Configuration**: 2-3 read replicas for load distribution
- **Synchronization**: Asynchronous replication
- **Failover**: Automatic promotion of replica to master

## Schema Design

### Core Tables

#### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    grade INTEGER CHECK (grade BETWEEN 7 AND 9),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_grade ON users(grade);
CREATE INDEX idx_users_active ON users(is_active);
```

#### courses
```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INTEGER NOT NULL REFERENCES users(id),
    grade INTEGER NOT NULL CHECK (grade BETWEEN 7 AND 9),
    category VARCHAR(100) NOT NULL,
    methodology VARCHAR(100),
    duration VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    max_students INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_grade ON courses(grade);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_active ON courses(is_active);
CREATE FULLTEXT INDEX idx_courses_search ON courses(title, description);
```

#### course_modules
```sql
CREATE TABLE course_modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module_type VARCHAR(50) NOT NULL, -- 'video', 'quiz', 'assignment', 'reading'
    content_url VARCHAR(500),
    content_text TEXT,
    duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_modules_course ON course_modules(course_id);
CREATE INDEX idx_modules_type ON course_modules(module_type);
CREATE INDEX idx_modules_order ON course_modules(course_id, sequence_order);
```

#### enrollments
```sql
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    current_module_id INTEGER REFERENCES course_modules(id),
    status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
    grade VARCHAR(5), -- A, B, C, D, F
    notes TEXT
);

-- Indexes
CREATE UNIQUE INDEX idx_enrollments_student_course ON enrollments(student_id, course_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_progress ON enrollments(progress_percentage);
```

#### module_progress
```sql
CREATE TABLE module_progress (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES course_modules(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent_minutes INTEGER DEFAULT 0,
    score DECIMAL(5,2),
    attempts INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed'))
);

-- Indexes
CREATE UNIQUE INDEX idx_progress_enrollment_module ON module_progress(enrollment_id, module_id);
CREATE INDEX idx_progress_status ON module_progress(status);
```

#### assessments
```sql
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id),
    module_id INTEGER REFERENCES course_modules(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(50) NOT NULL, -- 'quiz', 'assignment', 'project'
    total_points INTEGER NOT NULL,
    passing_score INTEGER,
    time_limit_minutes INTEGER,
    is_graded BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_assessments_course ON assessments(course_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
```

#### assessment_submissions
```sql
CREATE TABLE assessment_submissions (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT, -- JSON for quiz answers or file URL for assignments
    file_url VARCHAR(500),
    score DECIMAL(5,2),
    feedback TEXT,
    graded_by INTEGER REFERENCES users(id),
    graded_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned'))
);

-- Indexes
CREATE INDEX idx_submissions_assessment ON assessment_submissions(assessment_id);
CREATE INDEX idx_submissions_student ON assessment_submissions(student_id);
CREATE INDEX idx_submissions_status ON assessment_submissions(status);
```

## Database Optimization

### Indexing Strategy

#### Primary Keys
- All tables have SERIAL PRIMARY KEY for auto-incrementing IDs
- Primary keys are automatically indexed

#### Foreign Keys
- All foreign key relationships are indexed
- Cascading deletes where appropriate

#### Composite Indexes
```sql
-- For enrollment queries
CREATE INDEX idx_enrollments_student_status ON enrollments(student_id, status);

-- For course filtering
CREATE INDEX idx_courses_grade_category ON courses(grade, category);

-- For progress tracking
CREATE INDEX idx_progress_enrollment_status ON module_progress(enrollment_id, status);
```

#### Full-Text Search
```sql
-- Course search
CREATE FULLTEXT INDEX idx_courses_fts ON courses
USING gin(to_tsvector('english', title || ' ' || description));

-- User search
CREATE FULLTEXT INDEX idx_users_fts ON users
USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || email));
```

### Partitioning Strategy

#### Time-Based Partitioning
```sql
-- Partition enrollments by year
CREATE TABLE enrollments_2024 PARTITION OF enrollments
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE enrollments_2025 PARTITION OF enrollments
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

#### Hash Partitioning for Large Tables
```sql
-- Partition users by hash for even distribution
CREATE TABLE users_0 PARTITION OF users
    FOR VALUES WITH (modulus 4, remainder 0);

CREATE TABLE users_1 PARTITION OF users
    FOR VALUES WITH (modulus 4, remainder 1);
```

### Query Optimization

#### Common Query Patterns
```sql
-- Student dashboard query (optimized)
SELECT c.title, c.category, e.progress_percentage, e.status
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = $1 AND e.status != 'dropped'
ORDER BY e.enrolled_at DESC;

-- Course analytics query
SELECT
    COUNT(*) as total_students,
    AVG(progress_percentage) as avg_progress,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
FROM enrollments
WHERE course_id = $1;
```

#### View Definitions
```sql
-- Student progress view
CREATE VIEW student_progress AS
SELECT
    u.id as student_id,
    u.first_name,
    u.last_name,
    c.id as course_id,
    c.title as course_title,
    c.grade,
    e.progress_percentage,
    e.status,
    e.enrolled_at
FROM users u
JOIN enrollments e ON u.id = e.student_id
JOIN courses c ON e.course_id = c.id
WHERE u.role = 'student';

-- Course statistics view
CREATE VIEW course_stats AS
SELECT
    c.id,
    c.title,
    c.grade,
    c.category,
    COUNT(e.id) as enrolled_students,
    AVG(e.progress_percentage) as avg_progress,
    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_students
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.grade, c.category;
```

## Caching Strategy

### Redis Cache Keys
```
user:{id}              # User profile data
course:{id}            # Course information
enrollment:{user_id}   # User's enrollments
progress:{user_id}:{course_id}  # Course progress
session:{token}        # Session data
rate_limit:{user_id}   # Rate limiting data
```

### Cache TTL Values
- User profiles: 1 hour
- Course data: 30 minutes
- Enrollments: 15 minutes
- Session data: 24 hours
- Rate limits: 1 hour

## Backup and Recovery

### Backup Strategy
```bash
# Daily full backup
pg_dump watoto_lms > backup_$(date +%Y%m%d).sql

# Hourly incremental backup
pg_dump --data-only --inserts watoto_lms > incremental_$(date +%Y%m%d_%H).sql
```

### Point-in-Time Recovery
```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /var/lib/postgresql/archive/%f';
```

## Monitoring and Maintenance

### Key Metrics to Monitor
- Query execution time
- Connection count
- Cache hit ratio
- Replication lag
- Table bloat

### Maintenance Tasks
```sql
-- Update statistics
ANALYZE;

-- Reindex tables
REINDEX TABLE CONCURRENTLY users;
REINDEX TABLE CONCURRENTLY courses;

-- Vacuum for space reclamation
VACUUM (ANALYZE, VERBOSE);
```

## Migration Strategy

### Version Control
```sql
-- Create migration table
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Migration Example
```sql
-- Migration: Add grade column to users
BEGIN;
ALTER TABLE users ADD COLUMN grade INTEGER CHECK (grade BETWEEN 7 AND 9);
INSERT INTO schema_migrations (version) VALUES ('001_add_grade_to_users');
COMMIT;
```

## Performance Benchmarks

### Expected Performance
- **Read Queries**: < 10ms for simple queries
- **Write Queries**: < 50ms for insert/update
- **Complex Reports**: < 500ms
- **Concurrent Users**: 10,000+ with proper indexing

### Load Testing
```bash
# Using pgbench
pgbench -i -s 10 watoto_lms  # Initialize test data
pgbench -c 50 -j 4 -T 60 watoto_lms  # 50 concurrent connections for 60 seconds
```

This database design provides a solid foundation for the Watoto LMS, balancing performance, scalability, and maintainability while following database best practices from the system design primer.