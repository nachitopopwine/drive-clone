#!/bin/bash

echo "Creating S3 bucket..."

awslocal s3 mb s3://drive-bucket || true

awslocal s3api put-bucket-versioning \
  --bucket drive-bucket \
  --versioning-configuration Status=Enabled

echo "Bucket drive-bucket created successfully"