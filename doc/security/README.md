# Watoto LMS Security Documentation

## Overview

This document outlines the comprehensive security measures implemented in the Watoto LMS, following security best practices from the system-design-primer and OWASP guidelines.

## Security Architecture

### Defense in Depth Strategy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Network       │    │   Application   │    │   Data          │
│   Security      │    │   Security      │    │   Security      │
│                 │    │                 │    │                 │
│ • Firewall      │    │ • Input         │    │ • Encryption    │
│ • DDoS          │    │   Validation    │    │ • Access        │
│ • SSL/TLS       │    │ • XSS Prevention│    │   Control       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Network Security

### SSL/TLS Configuration

#### Certificate Management
```bash
# Generate self-signed certificate for development
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Production: Let's Encrypt
certbot --nginx -d yourdomain.com
```

#### SSL Configuration (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Other security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy strict-origin-when-cross-origin;
}
```

### Firewall Configuration

#### UFW (Ubuntu Firewall)
```bash
# Enable UFW
sudo ufw enable

# Allow necessary services
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (restrict to specific IPs)
sudo ufw allow 6379  # Redis (restrict to localhost)

# Rate limiting for SSH
sudo ufw limit ssh
```

#### Fail2Ban Configuration
```bash
# Install fail2ban
sudo apt install fail2ban

# Configure jail for SSH
sudo tee /etc/fail2ban/jail.local > /dev/null << EOF
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

# Restart fail2ban
sudo systemctl restart fail2ban
```

## Application Security

### Content Security Policy (CSP)

#### Frontend CSP Implementation
```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
">
```

#### CSP Violation Reporting
```javascript
// Report CSP violations
document.addEventListener('securitypolicyviolation', (e) => {
    console.error('CSP Violation:', {
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        sourceFile: e.sourceFile,
        lineNumber: e.lineNumber
    });

    // Send to logging service
    fetch('/api/security/csp-report', {
        method: 'POST',
        body: JSON.stringify({
            documentURI: e.documentURI,
            violatedDirective: e.violatedDirective,
            originalPolicy: e.originalPolicy,
            blockedURI: e.blockedURI
        })
    });
});
```

### Input Validation and Sanitization

#### Frontend Input Validation
```javascript
// src/utils/validation.js
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};
```

#### Backend Input Validation (Flask)
```python
# backend/app.py
from flask import Flask, request, jsonify
from wtforms import Form, StringField, validators
import bleach

app = Flask(__name__)

class CourseForm(Form):
    title = StringField('title', [validators.Length(min=1, max=255)])
    description = StringField('description', [validators.Length(max=1000)])

@app.route('/api/courses', methods=['POST'])
def create_course():
    form = CourseForm(request.form)
    if not form.validate():
        return jsonify({'error': 'Invalid input'}), 400

    # Sanitize input
    title = bleach.clean(request.form.get('title', ''))
    description = bleach.clean(request.form.get('description', ''))

    # Continue with sanitized data
    return jsonify({'message': 'Course created'}), 201
```

### Authentication & Authorization

#### JWT Implementation
```python
# backend/auth.py
import jwt
import datetime
from functools import wraps
from flask import request, jsonify

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)
    return decorated
```

#### Password Security
```python
# backend/auth.py
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

def hash_password(password):
    return generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)

def generate_secure_token():
    return secrets.token_urlsafe(32)
```

### Session Management

#### Redis Session Store
```python
# backend/sessions.py
import redis
import json
from datetime import datetime, timedelta

redis_client = redis.Redis(host='localhost', port=6379, db=0)

class SessionManager:
    def __init__(self):
        self.redis = redis_client
        self.session_timeout = 3600  # 1 hour

    def create_session(self, user_id, user_data):
        session_id = generate_secure_token()
        session_data = {
            'user_id': user_id,
            'user_data': user_data,
            'created_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + timedelta(seconds=self.session_timeout)).isoformat()
        }

        self.redis.setex(f'session:{session_id}', self.session_timeout, json.dumps(session_data))
        return session_id

    def get_session(self, session_id):
        session_data = self.redis.get(f'session:{session_id}')
        if session_data:
            return json.loads(session_data)
        return None

    def destroy_session(self, session_id):
        self.redis.delete(f'session:{session_id}')
```

## Data Security

### Database Security

#### Connection Security
```python
# backend/database.py
import psycopg2
import psycopg2.extras

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="watoto_lms",
        user="watoto_user",
        password="secure_password",
        sslmode="require"  # Enforce SSL
    )
```

#### SQL Injection Prevention
```python
# Safe query execution
def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Use parameterized queries
    cursor.execute("""
        SELECT id, email, first_name, last_name
        FROM users
        WHERE id = %s AND is_active = %s
    """, (user_id, True))

    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user
```

### File Upload Security

#### Secure File Upload
```python
# backend/uploads.py
import os
import magic
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_content(file_path):
    mime = magic.Magic(mime=True)
    file_type = mime.from_file(file_path)

    # Validate MIME type matches extension
    if file_path.endswith(('.jpg', '.jpeg', '.png', '.gif')):
        if not file_type.startswith('image/'):
            return False
    elif file_path.endswith('.pdf'):
        if file_type != 'application/pdf':
            return False

    return True

def secure_upload(file, upload_folder):
    if not allowed_file(file.filename):
        raise ValueError('File type not allowed')

    filename = secure_filename(file.filename)
    file_path = os.path.join(upload_folder, filename)

    # Check file size
    file.seek(0, os.SEEK_END)
    size = file.tell()
    if size > MAX_FILE_SIZE:
        raise ValueError('File too large')

    file.seek(0)
    file.save(file_path)

    # Validate file content
    if not validate_file_content(file_path):
        os.remove(file_path)
        raise ValueError('Invalid file content')

    return filename
```

## API Security

### Rate Limiting

#### Redis-based Rate Limiting
```python
# backend/rate_limit.py
from flask import request, jsonify
from functools import wraps
import time

class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client

    def is_rate_limited(self, key, limit=100, window=3600):
        current = int(time.time())
        window_start = current - window

        # Clean old entries
        self.redis.zremrangebyscore(key, 0, window_start)

        # Count requests in current window
        request_count = self.redis.zcard(key)

        if request_count >= limit:
            return True

        # Add current request
        self.redis.zadd(key, {str(current): current})
        self.redis.expire(key, window)

        return False

rate_limiter = RateLimiter(redis_client)

def rate_limit(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        client_ip = request.remote_addr
        key = f"rate_limit:{client_ip}"

        if rate_limiter.is_rate_limited(key):
            return jsonify({'error': 'Rate limit exceeded'}), 429

        return f(*args, **kwargs)
    return decorated_function
```

### CORS Configuration

#### Secure CORS Setup
```python
# backend/app.py
from flask_cors import CORS

app = Flask(__name__)

# Secure CORS configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Authorization", "Content-Type"],
        "expose_headers": ["X-Total-Count"],
        "supports_credentials": True
    }
})
```

## Monitoring and Logging

### Security Event Logging

#### Comprehensive Logging
```python
# backend/logging.py
import logging
import json
from datetime import datetime

class SecurityLogger:
    def __init__(self):
        self.logger = logging.getLogger('security')
        self.logger.setLevel(logging.INFO)

        # File handler
        handler = logging.FileHandler('/var/log/watoto-lms/security.log')
        formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    def log_security_event(self, event_type, user_id=None, ip_address=None,
                          details=None, severity='INFO'):
        event = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'user_id': user_id,
            'ip_address': ip_address,
            'details': details,
            'severity': severity
        }

        if severity == 'CRITICAL':
            self.logger.critical(json.dumps(event))
        elif severity == 'ERROR':
            self.logger.error(json.dumps(event))
        elif severity == 'WARNING':
            self.logger.warning(json.dumps(event))
        else:
            self.logger.info(json.dumps(event))

# Usage
security_logger = SecurityLogger()

@app.route('/api/login', methods=['POST'])
def login():
    # ... authentication logic ...

    if login_failed:
        security_logger.log_security_event(
            'FAILED_LOGIN_ATTEMPT',
            ip_address=request.remote_addr,
            details={'username': username},
            severity='WARNING'
        )
        return jsonify({'error': 'Invalid credentials'}), 401

    security_logger.log_security_event(
        'SUCCESSFUL_LOGIN',
        user_id=user.id,
        ip_address=request.remote_addr
    )
    return jsonify({'token': token}), 200
```

### Intrusion Detection

#### Basic IDS Rules
```python
# backend/ids.py
class IntrusionDetector:
    def __init__(self):
        self.failed_attempts = {}
        self.blocked_ips = set()

    def check_intrusion(self, ip_address, endpoint):
        # Track failed login attempts
        if endpoint == '/api/login':
            if ip_address not in self.failed_attempts:
                self.failed_attempts[ip_address] = 0
            self.failed_attempts[ip_address] += 1

            if self.failed_attempts[ip_address] >= 5:
                self.blocked_ips.add(ip_address)
                security_logger.log_security_event(
                    'IP_BLOCKED',
                    ip_address=ip_address,
                    details={'reason': 'Too many failed login attempts'},
                    severity='CRITICAL'
                )
                return True

        # Check if IP is blocked
        if ip_address in self.blocked_ips:
            return True

        return False

ids = IntrusionDetector()

@app.before_request
def check_security():
    if ids.check_intrusion(request.remote_addr, request.path):
        return jsonify({'error': 'Access denied'}), 403
```

## Security Testing

### Automated Security Testing

#### Security Test Suite
```python
# tests/test_security.py
import pytest
from app import app
from utils.security import validate_password, sanitize_input

class TestSecurity:
    def test_password_validation(self):
        assert validate_password('StrongPass123!') == True
        assert validate_password('weak') == False

    def test_input_sanitization(self):
        malicious_input = '<script>alert("xss")</script>'
        sanitized = sanitize_input(malicious_input)
        assert '<script>' not in sanitized
        assert '<script>' in sanitized

    def test_rate_limiting(self, client):
        # Test rate limiting functionality
        for _ in range(101):
            response = client.get('/api/courses')
        assert response.status_code == 429

    def test_sql_injection_prevention(self, client):
        # Test SQL injection prevention
        malicious_query = "'; DROP TABLE users; --"
        response = client.get(f'/api/search?q={malicious_query}')
        assert response.status_code == 200  # Should not crash
        assert 'error' not in response.get_json()
```

### Penetration Testing Checklist

#### Manual Security Testing
- [ ] SQL Injection testing
- [ ] XSS vulnerability testing
- [ ] CSRF token validation
- [ ] Authentication bypass testing
- [ ] Authorization testing
- [ ] File upload vulnerability testing
- [ ] Rate limiting bypass testing
- [ ] SSL/TLS configuration testing

## Incident Response

### Security Incident Response Plan

#### 1. Detection
- Monitor security logs for anomalies
- Set up alerts for suspicious activities
- Regular security scanning

#### 2. Assessment
```bash
# Security assessment script
#!/bin/bash
echo "=== Security Assessment ==="
echo "Failed login attempts:"
grep "FAILED_LOGIN" /var/log/watoto-lms/security.log | tail -10

echo "Blocked IPs:"
grep "IP_BLOCKED" /var/log/watoto-lms/security.log | tail -5

echo "Recent security events:"
tail -20 /var/log/watoto-lms/security.log
```

#### 3. Containment
- Block suspicious IP addresses
- Disable compromised accounts
- Isolate affected systems

#### 4. Recovery
- Restore from clean backups
- Update passwords and tokens
- Patch vulnerabilities

#### 5. Lessons Learned
- Document incident details
- Update security measures
- Improve monitoring

## Compliance and Standards

### Security Standards Compliance

#### OWASP Top 10 Coverage
- [x] A01:2021 - Broken Access Control
- [x] A02:2021 - Cryptographic Failures
- [x] A03:2021 - Injection
- [x] A04:2021 - Insecure Design
- [x] A05:2021 - Security Misconfiguration
- [x] A06:2021 - Vulnerable Components
- [x] A07:2021 - Identification and Authentication Failures
- [x] A08:2021 - Software and Data Integrity Failures
- [x] A09:2021 - Security Logging and Monitoring Failures
- [x] A10:2021 - Server-Side Request Forgery

### Data Protection

#### GDPR Compliance
- Data minimization principles
- Right to erasure implementation
- Consent management
- Data breach notification procedures

#### FERPA Compliance (Education)
- Student data protection
- Parental consent mechanisms
- Data retention policies
- Secure data transmission

## Security Maintenance

### Regular Security Tasks

#### Weekly Tasks
- Review security logs
- Update security signatures
- Monitor system performance
- Check for security advisories

#### Monthly Tasks
- Security patch management
- Vulnerability scanning
- Access review
- Security training updates

#### Quarterly Tasks
- Penetration testing
- Security assessment
- Incident response drill
- Policy review

### Security Monitoring Dashboard

#### Key Metrics to Monitor
```python
# backend/monitoring.py
def get_security_metrics():
    return {
        'failed_login_attempts': redis_client.get('security:failed_logins'),
        'blocked_ips': redis_client.scard('security:blocked_ips'),
        'active_sessions': redis_client.keys('session:*').__len__(),
        'rate_limited_requests': redis_client.get('security:rate_limited'),
        'security_events_today': get_security_events_count()
    }
```

This comprehensive security implementation provides multiple layers of protection following industry best practices and regulatory requirements.