import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUpload.css';

const API_URL = 'http://localhost:3000/api/files';

function FileUpload({ onUploadSuccess }) {
  const onDrop = useCallback(async acceptedFiles => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onUploadSuccess(response.data);
      alert(`File "${file.name}" uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error uploading file: ${file.name}`);
    }
  };

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className="dropzone-content">
          <p className="dropzone-icon">📥</p>
          <p className="dropzone-text">Drop files here...</p>
        </div>
      ) : (
        <div className="dropzone-content">
          <p className="dropzone-icon">📤</p>
          <p className="dropzone-text">Drag & drop files here, or click to select</p>
          <p className="dropzone-hint">Supports: Images, Videos, PDFs, Documents, Text</p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
