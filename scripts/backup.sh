#!/bin/bash
# Backup & Recovery Strategy Script
# Executes a daily Postgres pg_dump and pushes to an S3 bucket or secondary storage for DR.

# Config
DB_USER=${POSTGRES_USER:-myuser}
DB_NAME=${POSTGRES_DB:-gym_db}
BACKUP_DIR="/tmp/pg_backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILE_NAME="$BACKUP_DIR/$DB_NAME-backup-$DATE.sql"

mkdir -p $BACKUP_DIR

echo "Starting database backup for $DB_NAME..."

# Step 1: Dump database via Docker container (or generic pg_dump)
docker exec gym-management-system-db-1 pg_dump -U $DB_USER $DB_NAME > $FILE_NAME

# Step 2: Compress backup
gzip -9 $FILE_NAME
echo "Backup compressed: $FILE_NAME.gz"

# Step 3: Optional S3 Upload / Retention Policy
# aws s3 cp $FILE_NAME.gz s3://my-gym-backups/database/
# find $BACKUP_DIR -type f -name "*.gz" -mtime +30 -exec rm {} \; 

echo "Backup complete!"
