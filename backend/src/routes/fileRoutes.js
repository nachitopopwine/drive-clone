const express = require("express");
const multer = require("multer");

const {
  uploadFile,
  getFiles,
  downloadFile
} = require("../controllers/fileController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post(
  "/upload",
  upload.single("file"),
  uploadFile
);

router.get("/", getFiles);

router.get(
  "/download/:key",
  downloadFile
);

module.exports = router;
