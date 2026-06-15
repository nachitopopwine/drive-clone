const {
  uploadFileToS3,
  getFilesFromS3,
  downloadFileFromS3
} = require("../services/s3Service");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const { originalname, buffer, mimetype } = req.file;

    const fileKey = await uploadFileToS3(originalname, buffer, mimetype);

    console.log(`File uploaded successfully: ${originalname}`);

    res.status(201).json({
      message: "File uploaded successfully",
      fileKey: fileKey,
      fileName: originalname
    });
  } catch (error) {
    console.error("Error in uploadFile:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await getFilesFromS3(3);
    res.json(files);
  } catch (error) {
    console.error("Error in getFiles:", error);
    res.status(500).json({ error: "Failed to retrieve files" });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({ error: "File key is required" });
    }

    const fileData = await downloadFileFromS3(key);

    res.setHeader("Content-Type", fileData.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileData.fileName}"`
    );

    res.send(fileData.buffer);
  } catch (error) {
    console.error("Error in downloadFile:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  downloadFile
};