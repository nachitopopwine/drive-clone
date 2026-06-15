import { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import './App.css';

const API_URL = 'http://localhost:3000/api/files';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadSuccess = (newFile) => {
    console.log('File uploaded:', newFile);
    // Refresh the file list
    setTimeout(fetchFiles, 500);
  };

  const handleDownload = async (fileKey, fileName) => {
    try {
      const response = await axios.get(`${API_URL}/download/${fileKey}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📁 Drive Clone</h1>
        <p>Simple file storage with LocalStack S3</p>
      </header>

      <main className="app-main">
        <section className="upload-section">
          <h2>Upload Files</h2>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </section>

        <section className="files-section">
          <h2>Recent Files (Last 3)</h2>
          {loading ? (
            <p className="loading">Loading files...</p>
          ) : files.length === 0 ? (
            <p className="no-files">No files uploaded yet. Start by dragging and dropping a file above!</p>
          ) : (
            <FileList files={files} onDownload={handleDownload} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
