const { S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",

  endpoint: process.env.S3_ENDPOINT || "http://minio:9000",

  forcePathStyle: true,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "minioadmin",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "minioadmin"
  }
});

module.exports = s3Client;