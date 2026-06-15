const {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand
} = require("@aws-sdk/client-s3");
const s3Client = require("../config/s3Client");

const BUCKET_NAME = "drive-bucket";

const uploadFileToS3 = async (fileName, fileBuffer, mimeType) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return params.Key;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

const getFilesFromS3 = async (limit = 3) => {
  const params = {
    Bucket: BUCKET_NAME,
    MaxKeys: limit + 10 // Get extra to sort and filter
  };

  try {
    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      return [];
    }

    // Sort by LastModified descending and get the latest `limit` files
    const files = response.Contents
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))
      .slice(0, limit)
      .map(file => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        name: file.Key.split('-').slice(1).join('-')
      }));

    return files;
  } catch (error) {
    console.error("Error getting files from S3:", error);
    throw error;
  }
};

const downloadFileFromS3 = async (fileKey) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    
    return {
      buffer: Buffer.concat(chunks),
      contentType: response.ContentType,
      fileName: fileKey.split('-').slice(1).join('-')
    };
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    throw error;
  }
};

const deleteFileFromS3 = async (fileKey) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
  getFilesFromS3,
  downloadFileFromS3,
  deleteFileFromS3
};
