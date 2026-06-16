#!/bin/sh

# Wait for MinIO to be ready
sleep 5

# Create the bucket using mc (MinIO CLI)
mc alias set myminio http://minio:9000 minioadmin minioadmin

# Create drive-bucket
mc mb myminio/drive-bucket || true

# Set versioning on the bucket
mc version enable myminio/drive-bucket || true

echo "MinIO bucket initialized successfully"
