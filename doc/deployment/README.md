# Watoto LMS Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Watoto LMS using free and open-source tools. The deployment follows system design principles for scalability, reliability, and maintainability.

## Prerequisites

### System Requirements
- **Operating System**: Ubuntu 20.04 LTS or CentOS 7+
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 20GB free space
- **Network**: Stable internet connection

### Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git unzip software-properties-common

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.9+
sudo apt install -y python3 python3-pip python3-venv

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.17.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Nginx (SSL)   │    │   Certbot       │
│   Load Balancer │    │   Let's Encrypt │
└─────────────────┘    └─────────────────┘
          │                       │
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   API Server    │
│   (Static)      │    │   (Flask)       │
└─────────────────┘    └─────────────────┘
          │                       │
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   Redis Cache   │
│   Database      │    │   (Sessions)    │
└─────────────────┘    └─────────────────┘
```

## Directory Structure

```
/opt/watoto-lms/
├── frontend/          # React application
├── backend/           # Flask API server
├── database/          # PostgreSQL data
├── redis/            # Redis data
├── nginx/            # Nginx configuration
├── ssl/              # SSL certificates
└── docker-compose.yml
```

## Step-by-Step Deployment

### Step 1: Project Setup

```bash
# Create project directory
sudo mkdir -p /opt/watoto-lms
sudo chown $USER:$USER /opt/watoto-lms
cd /opt/watoto-lms

# Clone repositories
git clone https://github.com/yourusername/watoto-lms-frontend.git frontend
git clone https://github.com/yourusername/watoto-lms-backend.git backend
```

### Step 2: Environment Configuration

```bash
# Create environment files
mkdir -p /opt/watoto-lms/config

# Frontend environment
cat > /opt/watoto-lms/config/frontend.env << EOF
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
EOF

# Backend environment
cat > /opt/watoto-lms/config/backend.env << EOF
FLASK_ENV=production
DATABASE_URL=postgresql://watoto_user:secure_password@localhost:5432/watoto_lms
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
EOF
```

### Step 3: Database Setup

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE watoto_lms;
CREATE USER watoto_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE watoto_lms TO watoto_user;
ALTER USER watoto_user CREATEDB;
EOF

# Run database migrations
cd /opt/watoto-lms/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
```

### Step 4: Redis Setup

```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis
sudo sed -i 's/supervised no/supervised systemd/' /etc/redis/redis.conf
sudo sed -i 's/bind 127.0.0.1 ::1/bind 127.0.0.1/' /etc/redis/redis.conf

# Start Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### Step 5: Backend Deployment

```bash
# Create backend service
sudo tee /etc/systemd/system/watoto-backend.service > /dev/null << EOF
[Unit]
Description=Watoto LMS Backend
After=network.target postgresql.service redis-server.service

[Service]
User=$USER
WorkingDirectory=/opt/watoto-lms/backend
Environment=PATH=/opt/watoto-lms/backend/venv/bin
ExecStart=/opt/watoto-lms/backend/venv/bin/gunicorn --bind 127.0.0.1:8000 --workers 4 wsgi:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start backend service
sudo systemctl daemon-reload
sudo systemctl enable watoto-backend
sudo systemctl start watoto-backend
```

### Step 6: Frontend Build and Deployment

```bash
# Build frontend
cd /opt/watoto-lms/frontend
npm install
npm run build

# Create frontend directory for nginx
sudo mkdir -p /var/www/watoto-lms
sudo cp -r build/* /var/www/watoto-lms/
sudo chown -R www-data:www-data /var/www/watoto-lms
```

### Step 7: Nginx Configuration

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/watoto-lms > /dev/null << EOF
# Upstream backend servers
upstream backend_servers {
    server 127.0.0.1:8000;
}

# Main server block
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend static files
    location / {
        root /var/www/watoto-lms;
        index index.html;
        try_files \$uri \$uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend_servers;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # API-specific headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/watoto-lms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: SSL Certificate Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Setup auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 9: Monitoring Setup

```bash
# Install monitoring tools
sudo apt install -y htop iotop sysstat

# Install Prometheus and Grafana (optional but recommended)
# Prometheus for metrics collection
# Grafana for dashboards

# Basic monitoring with systemd
sudo tee /etc/systemd/system/watoto-monitor.service > /dev/null << EOF
[Unit]
Description=Watoto LMS Monitoring
After=network.target

[Service]
User=$USER
ExecStart=/opt/watoto-lms/scripts/monitor.sh
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

### Step 10: Backup Configuration

```bash
# Create backup script
sudo tee /opt/watoto-lms/scripts/backup.sh > /dev/null << EOF
#!/bin/bash

# Database backup
pg_dump -U watoto_user -h localhost watoto_lms > /opt/backups/watoto_lms_$(date +%Y%m%d_%H%M%S).sql

# Frontend files backup
tar -czf /opt/backups/frontend_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/watoto-lms

# Clean old backups (keep last 7 days)
find /opt/backups -name "*.sql" -mtime +7 -delete
find /opt/backups -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed at $(date)"
EOF

# Make executable and create cron job
sudo chmod +x /opt/watoto-lms/scripts/backup.sh
sudo mkdir -p /opt/backups
sudo chown $USER:$USER /opt/backups

# Add to crontab for daily backups at 2 AM
(crontab -l ; echo "0 2 * * * /opt/watoto-lms/scripts/backup.sh") | crontab -
```

## Docker Deployment (Alternative)

### Docker Compose Setup

```yaml
# docker-compose.yml
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
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Backend API
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://watoto_user:secure_password@db:5432/watoto_lms
      - REDIS_URL=redis://redis:6379/0
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    restart: unless-stopped

  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Docker Deployment Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3

# Update services
docker-compose pull
docker-compose up -d
```

## Performance Optimization

### Nginx Optimization

```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

# Enable gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Cache settings
proxy_cache_path /tmp/nginx_cache levels=1:2 keys_zone=watoto_cache:10m max_size=1g inactive=60m;
proxy_cache watoto_cache;
```

### Database Optimization

```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_enrollments_student_progress ON enrollments(student_id, progress_percentage);
CREATE INDEX CONCURRENTLY idx_courses_grade_category_active ON courses(grade, category, is_active);

-- Enable query logging for monitoring
ALTER SYSTEM SET log_statement = 'ddl';
ALTER SYSTEM SET log_duration = on;
```

### Redis Optimization

```redis.conf
# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
```

## Security Hardening

### System Security

```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Install fail2ban for SSH protection
sudo apt install -y fail2ban

# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

### Application Security

```bash
# Install security updates automatically
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Set up log monitoring
sudo apt install -y logwatch
```

## Monitoring and Maintenance

### Health Checks

```bash
# Create health check script
cat > /opt/watoto-lms/scripts/health-check.sh << 'EOF'
#!/bin/bash

# Check services
services=("nginx" "watoto-backend" "postgresql" "redis-server")

for service in "${services[@]}"; do
    if systemctl is-active --quiet "$service"; then
        echo "✓ $service is running"
    else
        echo "✗ $service is not running"
        exit 1
    fi
done

# Check database connection
if PGPASSWORD=secure_password psql -h localhost -U watoto_user -d watoto_lms -c "SELECT 1" > /dev/null; then
    echo "✓ Database connection OK"
else
    echo "✗ Database connection failed"
    exit 1
fi

echo "All services are healthy"
EOF

chmod +x /opt/watoto-lms/scripts/health-check.sh
```

### Log Management

```bash
# Configure log rotation
sudo tee /etc/logrotate.d/watoto-lms > /dev/null << EOF
/opt/watoto-lms/backend/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload watoto-backend
    endscript
}
EOF
```

## Scaling Strategies

### Horizontal Scaling

```bash
# Add more backend servers
sudo tee /etc/nginx/conf.d/upstream.conf > /dev/null << EOF
upstream backend_servers {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
}
EOF
```

### Database Scaling

```sql
-- Add read replicas
CREATE PUBLICATION watoto_pub FOR ALL TABLES;
-- On replica server:
CREATE SUBSCRIPTION watoto_sub
    CONNECTION 'host=primary_host dbname=watoto_lms user=replication_user'
    PUBLICATION watoto_pub;
```

## Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check logs
sudo journalctl -u watoto-backend -f

# Check Python environment
cd /opt/watoto-lms/backend
source venv/bin/activate
python3 -c "import app; print('Backend imports OK')"
```

#### Database Connection Issues
```bash
# Test connection
PGPASSWORD=secure_password psql -h localhost -U watoto_user -d watoto_lms

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### Nginx Configuration Issues
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## Backup and Recovery

### Automated Backup Script

```bash
#!/bin/bash
# /opt/watoto-lms/scripts/full-backup.sh

BACKUP_DIR="/opt/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump -U watoto_user -h localhost watoto_lms > "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Application files
tar -czf "$BACKUP_DIR/app_$TIMESTAMP.tar.gz" /opt/watoto-lms

# Frontend files
tar -czf "$BACKUP_DIR/frontend_$TIMESTAMP.tar.gz" /var/www/watoto-lms

# Clean old backups
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Full backup completed: $TIMESTAMP"
```

### Recovery Procedure

```bash
# Stop services
sudo systemctl stop watoto-backend nginx

# Restore database
PGPASSWORD=secure_password psql -U watoto_user -h localhost watoto_lms < backup.sql

# Restore files
tar -xzf app_backup.tar.gz -C /opt
tar -xzf frontend_backup.tar.gz -C /var/www

# Start services
sudo systemctl start watoto-backend nginx
```

## Cost Optimization

### Resource Optimization
- **Auto-scaling**: Scale resources based on load
- **Spot instances**: Use cost-effective compute resources
- **CDN**: Reduce bandwidth costs with caching
- **Compression**: Reduce data transfer costs

### Monitoring Costs
- **Log aggregation**: Efficient log storage and analysis
- **Metrics retention**: Configure appropriate data retention
- **Alert optimization**: Reduce false positive alerts

This deployment guide provides a production-ready setup using free and open-source tools, following system design best practices for scalability, reliability, and maintainability.