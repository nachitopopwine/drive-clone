import './FileList.css';

function FileList({ files, onDownload }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="file-list">
      {files.map((file) => (
        <div key={file.key} className="file-item">
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <p className="file-name">{file.name}</p>
              <p className="file-meta">
                {formatFileSize(file.size)} • {formatDate(file.lastModified)}
              </p>
            </div>
          </div>
          <button
            className="download-btn"
            onClick={() => onDownload(file.key, file.name)}
          >
            ⬇️ Download
          </button>
        </div>
      ))}
    </div>
  );
}

export default FileList;
