# Watoto LMS Scalability Guide

## Overview

This document outlines the scalability strategies for the Watoto LMS, designed to handle growth from hundreds to millions of users while maintaining performance and reliability.

## Scalability Principles

### Performance vs Scalability
- **Performance**: How fast the system is for a single user
- **Scalability**: How well the system handles growth in users/traffic
- **Trade-offs**: Everything is a trade-off - optimize based on use case

### Key Metrics
- **Response Time**: < 200ms for API calls
- **Throughput**: 1000+ requests/second
- **Availability**: 99.9% uptime
- **Concurrent Users**: 10,000+ simultaneous users

## System Architecture

### Current Architecture
```
┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Web Servers   │
│    (Nginx)      │────►│   (React SPA)  │
└─────────────────┘    └─────────────────┘
          │                       │
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   App Servers   │
│   (Nginx)       │────►│   (Flask)      │
└─────────────────┘    └─────────────────┘
          │                       │
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Cache         │
│ (PostgreSQL)    │    │   (Redis)       │
└─────────────────┘    └─────────────────┘
```

### Target Architecture (Scaled)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Load Balancer │    │   Web Servers   │
│ (CloudFlare)    │────►│    (Nginx)     │────►│   (React SPA)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   App Servers   │    │   Message Queue │
│   (Kong)        │────►│   (Flask)      │────►│   (RabbitMQ)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Cache Cluster │    │   File Storage  │
│ (PostgreSQL     │    │   (Redis)       │    │   (AWS S3)      │
│  Cluster)       │    └─────────────────┘    └─────────────────┘
└─────────────────┘
```

## Horizontal Scaling Strategies

### 1. Load Balancing

#### Nginx Load Balancer Configuration
```nginx
# /etc/nginx/nginx.conf
upstream backend_servers {
    least_conn;  # Least connections algorithm
    server app1.example.com:8000 weight=3;
    server app2.example.com:8000 weight=3;
    server app3.example.com:8000 weight=1;  # Backup server
    server app4.example.com:8000 backup;   # Only used when others fail
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Health checks
        health_check interval=10 fails=3 passes=2;
    }
}
```

#### Load Balancing Algorithms
- **Round Robin**: Simple distribution
- **Least Connections**: Send to server with fewest active connections
- **IP Hash**: Route based on client IP (session persistence)
- **Weighted**: Distribute based on server capacity

### 2. Database Scaling

#### Read Replicas Setup
```sql
-- Enable replication
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET max_wal_senders = 10;
ALTER SYSTEM SET wal_keep_segments = 32;

-- Create replication user
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replica_password';

-- Grant permissions
GRANT pg_read_all_data TO replicator;
```

#### Connection Pooling
```python
# backend/database.py
from psycopg2 import pool

# Create connection pool
connection_pool = pool.SimpleConnectionPool(
    1, 20,  # Min and max connections
    host="localhost",
    database="watoto_lms",
    user="watoto_user",
    password="secure_password"
)

def get_connection():
    return connection_pool.getconn()

def release_connection(conn):
    connection_pool.putconn(conn)
```

#### Database Sharding Strategy
```python
# backend/sharding.py
class DatabaseShard:
    def __init__(self):
        self.shards = {
            'shard_0': {'host': 'db1.example.com', 'range': (0, 100000)},
            'shard_1': {'host': 'db2.example.com', 'range': (100001, 200000)},
            'shard_2': {'host': 'db3.example.com', 'range': (200001, 300000)}
        }

    def get_shard(self, user_id):
        for shard_name, config in self.shards.items():
            if config['range'][0] <= user_id <= config['range'][1]:
                return config
        return None

    def get_user_shard(self, user_id):
        shard_config = self.get_shard(user_id)
        return self.connect_to_shard(shard_config)
```

### 3. Caching Strategies

#### Multi-Level Caching
```python
# backend/cache.py
import redis
from flask_caching import Cache

class MultiLevelCache:
    def __init__(self):
        # L1: Application cache
        self.app_cache = Cache(config={'CACHE_TYPE': 'simple'})

        # L2: Redis cache
        self.redis_cache = redis.Redis(
            host='localhost',
            port=6379,
            db=0,
            decode_responses=True
        )

        # L3: CDN (handled by Nginx/CloudFlare)
        pass

    def get(self, key):
        # Try L1 cache first
        value = self.app_cache.get(key)
        if value:
            return value

        # Try L2 cache
        value = self.redis_cache.get(key)
        if value:
            # Populate L1 cache
            self.app_cache.set(key, value, timeout=300)
            return value

        return None

    def set(self, key, value, timeout=3600):
        # Set in both caches
        self.app_cache.set(key, value, timeout=300)
        self.redis_cache.setex(key, timeout, value)
```

#### Cache Invalidation Strategies
```python
# backend/cache_invalidation.py
class CacheInvalidation:
    def __init__(self, redis_client):
        self.redis = redis_client

    def invalidate_user_cache(self, user_id):
        """Invalidate all user-related cache entries"""
        keys_to_delete = [
            f'user:{user_id}',
            f'user:{user_id}:courses',
            f'user:{user_id}:progress'
        ]

        # Also invalidate pattern-based keys
        pattern_keys = self.redis.keys(f'user:{user_id}:*')
        keys_to_delete.extend(pattern_keys)

        if keys_to_delete:
            self.redis.delete(*keys_to_delete)

    def invalidate_course_cache(self, course_id):
        """Invalidate course-related cache"""
        keys_to_delete = [
            f'course:{course_id}',
            f'course:{course_id}:students',
            f'course:{course_id}:modules'
        ]

        # Invalidate enrolled users' course lists
        enrolled_users = self.get_enrolled_users(course_id)
        for user_id in enrolled_users:
            keys_to_delete.append(f'user:{user_id}:courses')

        self.redis.delete(*keys_to_delete)
```

### 4. Asynchronous Processing

#### Message Queue Implementation
```python
# backend/queue.py
import pika
import json
from threading import Thread

class MessageQueue:
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters('localhost')
        )
        self.channel = self.connection.channel()

        # Declare queues
        self.channel.queue_declare(queue='email_queue', durable=True)
        self.channel.queue_declare(queue='notification_queue', durable=True)
        self.channel.queue_declare(queue='analytics_queue', durable=True)

    def publish_message(self, queue_name, message):
        """Publish message to queue"""
        self.channel.basic_publish(
            exchange='',
            routing_key=queue_name,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
            )
        )

    def consume_messages(self, queue_name, callback):
        """Consume messages from queue"""
        def wrapper(ch, method, properties, body):
            try:
                message = json.loads(body)
                callback(message)
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                print(f"Error processing message: {e}")
                ch.basic_nack(delivery_tag=method.delivery_tag)

        self.channel.basic_consume(
            queue=queue_name,
            on_message_callback=wrapper
        )

        # Start consuming in a separate thread
        thread = Thread(target=self.channel.start_consuming)
        thread.daemon = True
        thread.start()
```

#### Background Job Processing
```python
# backend/jobs.py
from message_queue import MessageQueue

class BackgroundJobs:
    def __init__(self):
        self.queue = MessageQueue()

    def send_welcome_email(self, user_id, email):
        """Queue welcome email job"""
        message = {
            'type': 'welcome_email',
            'user_id': user_id,
            'email': email,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.queue.publish_message('email_queue', message)

    def update_course_progress(self, enrollment_id, progress_data):
        """Queue progress update job"""
        message = {
            'type': 'progress_update',
            'enrollment_id': enrollment_id,
            'progress_data': progress_data
        }
        self.queue.publish_message('analytics_queue', message)

    def send_notification(self, user_id, notification_data):
        """Queue notification job"""
        message = {
            'type': 'notification',
            'user_id': user_id,
            'notification': notification_data
        }
        self.queue.publish_message('notification_queue', message)

# Worker processes
def email_worker():
    """Process email jobs"""
    def process_email(message):
        if message['type'] == 'welcome_email':
            send_welcome_email_to_user(message['user_id'], message['email'])
        # Process other email types...

    queue.consume_messages('email_queue', process_email)

def analytics_worker():
    """Process analytics jobs"""
    def process_analytics(message):
        if message['type'] == 'progress_update':
            update_user_progress(message['enrollment_id'], message['progress_data'])
        # Process other analytics...

    queue.consume_messages('analytics_queue', process_analytics)
```

## Performance Optimization

### Database Optimization

#### Query Optimization
```sql
-- Create optimized indexes
CREATE INDEX CONCURRENTLY idx_enrollments_user_progress
ON enrollments(user_id, progress_percentage DESC);

CREATE INDEX CONCURRENTLY idx_course_modules_course_sequence
ON course_modules(course_id, sequence_order);

-- Use partial indexes for active data
CREATE INDEX CONCURRENTLY idx_active_users
ON users(created_at) WHERE is_active = true;

-- Use covering indexes
CREATE INDEX CONCURRENTLY idx_user_courses_covering
ON enrollments(user_id, course_id, progress_percentage, status);
```

#### Query Performance Monitoring
```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'ddl';
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1 second

-- Monitor slow queries
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Application Optimization

#### Response Compression
```nginx
# /etc/nginx/nginx.conf
gzip on;
gzip_types
    text/plain
    text/css
    application/json
    application/javascript
    text/xml
    application/xml
    application/xml+rss
    text/javascript;
gzip_min_length 1024;
gzip_comp_level 6;
```

#### Static Asset Optimization
```python
# backend/app.py
from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/static/<path:filename>')
def serve_static(filename):
    # Set cache headers for static files
    response = send_from_directory(
        os.path.join(app.root_path, 'static'),
        filename
    )
    response.headers['Cache-Control'] = 'public, max-age=31536000'  # 1 year
    return response
```

### CDN Integration

#### CloudFlare Configuration
```javascript
// frontend/src/config.js
export const CDN_CONFIG = {
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://cdn.yourdomain.com'
        : 'http://localhost:3000',
    imageOptimization: true,
    cacheTTL: 86400  // 24 hours
};
```

## Monitoring and Alerting

### Key Metrics to Monitor

#### Application Metrics
```python
# backend/monitoring.py
from prometheus_client import Counter, Histogram, Gauge
import time

# Request metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency', ['method', 'endpoint'])

# Business metrics
ACTIVE_USERS = Gauge('active_users', 'Number of active users')
COURSE_COMPLETIONS = Counter('course_completions_total', 'Total course completions')

@app.before_request
def start_timer():
    request.start_time = time.time()

@app.after_request
def record_metrics(response):
    request_latency = time.time() - request.start_time

    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.path,
        status=response.status_code
    ).inc()

    REQUEST_LATENCY.labels(
        method=request.method,
        endpoint=request.path
    ).observe(request_latency)

    return response
```

#### Infrastructure Metrics
- CPU usage per server
- Memory usage per server
- Database connection count
- Cache hit/miss ratio
- Network I/O
- Disk I/O

### Alerting Rules

#### Prometheus Alerting Rules
```yaml
# /etc/prometheus/alert_rules.yml
groups:
  - name: watoto_lms_alerts
    rules:
      - alert: HighCPUUsage
        expr: cpu_usage_percent > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is {{ $value }}% on {{ $labels.instance }}"

      - alert: DatabaseConnectionPoolExhausted
        expr: db_connections_active / db_connections_total > 0.9
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool exhausted"
          description: "Connection pool usage is {{ $value }}%"

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response time detected"
          description: "95th percentile response time is {{ $value }}s"
```

## Auto-Scaling

### Horizontal Pod Autoscaling (Kubernetes)
```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: watoto-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: watoto-backend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### AWS Auto Scaling
```json
# aws-autoscaling-config.json
{
  "AutoScalingGroupName": "watoto-backend-asg",
  "MinSize": 2,
  "MaxSize": 10,
  "DesiredCapacity": 3,
  "DefaultCooldown": 300,
  "AvailabilityZones": ["us-east-1a", "us-east-1b", "us-east-1c"],
  "HealthCheckType": "EC2",
  "HealthCheckGracePeriod": 300,
  "LaunchTemplate": {
    "LaunchTemplateName": "watoto-backend-template",
    "Version": "$Latest"
  },
  "TargetGroupARNs": ["arn:aws:elasticloadbalancing:..."]
}
```

## Capacity Planning

### User Growth Projections

#### Current Usage (Month 1-3)
- Daily Active Users: 500
- Peak Concurrent Users: 100
- API Requests/Day: 50,000
- Database Size: 1GB

#### Projected Growth (Month 4-12)
- Daily Active Users: 5,000
- Peak Concurrent Users: 1,000
- API Requests/Day: 500,000
- Database Size: 10GB

#### Long-term Growth (Year 2+)
- Daily Active Users: 50,000
- Peak Concurrent Users: 10,000
- API Requests/Day: 5,000,000
- Database Size: 100GB+

### Infrastructure Scaling Plan

#### Phase 1: Optimization (Current)
- Database query optimization
- Caching implementation
- CDN integration
- Code optimization

#### Phase 2: Horizontal Scaling
- Load balancer addition
- Database read replicas
- Application server clustering
- Redis clustering

#### Phase 3: Advanced Scaling
- Database sharding
- Microservices architecture
- Multi-region deployment
- Advanced caching strategies

## Cost Optimization

### Infrastructure Costs
- **Reserved Instances**: 40-60% savings vs on-demand
- **Spot Instances**: 70-90% savings for non-critical workloads
- **Auto-scaling**: Pay only for what you use
- **CDN**: Reduce bandwidth costs

### Development Costs
- **Open Source Tools**: Free and community-supported
- **Automated Testing**: Reduce bug-fix costs
- **Infrastructure as Code**: Faster deployment and consistency
- **Monitoring**: Prevent costly downtime

## Disaster Recovery

### Backup Strategy
```bash
# /opt/watoto-lms/scripts/disaster-recovery.sh
#!/bin/bash

# Create backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump -U watoto_user -h primary-db watoto_lms > /backups/db_$TIMESTAMP.sql

# Application backup
tar -czf /backups/app_$TIMESTAMP.tar.gz /opt/watoto-lms

# Upload to S3
aws s3 cp /backups/db_$TIMESTAMP.sql s3://watoto-backups/database/
aws s3 cp /backups/app_$TIMESTAMP.tar.gz s3://watoto-backups/application/

# Clean old backups
find /backups -name "*.sql" -mtime +30 -delete
find /backups -name "*.tar.gz" -mtime +30 -delete
```

### Recovery Time Objective (RTO)
- **Critical Systems**: 1 hour
- **Important Systems**: 4 hours
- **Standard Systems**: 24 hours

### Recovery Point Objective (RPO)
- **Critical Data**: 5 minutes
- **Important Data**: 1 hour
- **Standard Data**: 24 hours

## Performance Benchmarks

### Target Performance Metrics

#### API Response Times
- **Simple queries**: < 100ms
- **Complex queries**: < 500ms
- **File uploads**: < 2 seconds
- **Report generation**: < 10 seconds

#### Throughput
- **API requests**: 1000+ RPS
- **Database queries**: 10,000+ QPS
- **File serving**: 1000+ concurrent downloads

#### Availability
- **Uptime**: 99.9% (8.76 hours downtime/year)
- **Error rate**: < 0.1%
- **Data durability**: 99.999999999% (11 9s)

### Load Testing

#### Using Apache Bench
```bash
# Test API endpoints
ab -n 10000 -c 100 http://api.example.com/api/courses

# Test static file serving
ab -n 10000 -c 100 http://cdn.example.com/static/main.js
```

#### Using Locust (Python)
```python
# tests/load_test.py
from locust import HttpUser, task, between

class LMSUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def view_courses(self):
        self.client.get("/api/courses")

    @task(2)
    def view_course_details(self):
        self.client.get("/api/courses/1")

    @task(1)
    def enroll_course(self):
        self.client.post("/api/enrollments", json={"course_id": 1})

# Run with: locust -f tests/load_test.py --host=http://api.example.com
```

This scalability guide provides a comprehensive roadmap for growing the Watoto LMS from a small educational platform to a large-scale system capable of serving millions of users while maintaining high performance and reliability.