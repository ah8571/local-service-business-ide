import React, { useState, useRef, useCallback } from 'react';
import './PhotoUpload.css';

const PhotoUpload = ({ onPhotosUploaded, uploadedPhotos = [] }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleFiles(imageFiles);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('photos', file);
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));
    });

    try {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          files.forEach(file => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: percentComplete
            }));
          });
        }
      };

      // Handle response
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            onPhotosUploaded(response.images);
            setUploadProgress({});
          } else {
            console.error('Upload failed:', response.error);
          }
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        console.error('Upload failed');
        setUploading(false);
        setUploadProgress({});
      };

      xhr.open('POST', 'http://localhost:5000/api/upload-photos');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
      setUploadProgress({});
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="photo-upload-container">
      <div
        className={`photo-upload-area ${isDragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {!uploading ? (
          <div className="upload-content">
            <div className="upload-icon">📸</div>
            <h3>Upload Photos</h3>
            <p>Drag and drop your photos here, or click to select files</p>
            <p className="upload-hint">
              Supports: JPG, PNG, GIF, WebP • Max 10MB per file
            </p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon spinning">⟳</div>
            <h3>Processing Photos...</h3>
            <p>Optimizing images for web performance</p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress">
          <h4>Upload Progress</h4>
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="progress-item">
              <div className="progress-info">
                <span className="filename">{filename}</span>
                <span className="percentage">{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Photos Preview */}
      {uploadedPhotos.length > 0 && (
        <div className="uploaded-photos">
          <h4>Uploaded Photos ({uploadedPhotos.length})</h4>
          <div className="photos-grid">
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className="photo-item">
                <div className="photo-preview">
                  {photo.processed?.thumbnail ? (
                    <img 
                      src={`http://localhost:5000/uploads/${photo.processed.thumbnail}`}
                      alt={photo.originalName}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="photo-placeholder" style={{ display: 'none' }}>
                    <span>📷</span>
                  </div>
                </div>
                <div className="photo-info">
                  <div className="photo-name" title={photo.originalName}>
                    {photo.originalName}
                  </div>
                  {photo.analysis && (
                    <div className="photo-details">
                      <div className="photo-dimensions">
                        {photo.analysis.dimensions}
                      </div>
                      <div className="photo-use-cases">
                        Suitable for: {photo.analysis.suitableFor?.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;