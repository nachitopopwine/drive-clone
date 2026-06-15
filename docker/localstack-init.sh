#!/bin/bash
# LocalStack initialization script

# Wait for LocalStack to be ready
sleep 10

# Create the S3 bucket
awslocal s3 mb s3://drive-bucket --region us-east-1

# Set bucket versioning
awslocal s3api put-bucket-versioning \
  --bucket drive-bucket \
  --versioning-configuration Status=Enabled \
  --region us-east-1

echo "LocalStack S3 bucket 'drive-bucket' created successfully!"
