variable "aws_region" {
  description = "AWS region for LocalStack"
  type        = string
  default     = "us-east-1"
}

variable "aws_access_key_id" {
  description = "AWS access key ID (dummy for LocalStack)"
  type        = string
  sensitive   = true
  default     = "test"
}

variable "aws_secret_access_key" {
  description = "AWS secret access key (dummy for LocalStack)"
  type        = string
  sensitive   = true
  default     = "test"
}

variable "localstack_endpoint" {
  description = "LocalStack S3 endpoint"
  type        = string
  default     = "http://localhost:4566"
}

variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
  default     = "drive-bucket"
}
