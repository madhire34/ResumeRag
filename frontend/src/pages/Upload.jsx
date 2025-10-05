import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const UploadContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const UploadCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isDragActive ? 'rgba(79, 70, 229, 0.05)' : 'transparent'};
  
  &:hover {
    border-color: var(--primary-color);
    background-color: rgba(79, 70, 229, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const UploadButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1.5rem;
  width: 100%;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:disabled {
    background-color: var(--text-light);
    cursor: not-allowed;
  }
`;

const FileInfo = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileName = styled.p`
  font-weight: 500;
  color: var(--text-primary);
`;

const FileSize = styled.span`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 1.5rem;
`;

const ProgressBar = styled.div`
  height: 0.5rem;
  background-color: var(--background-color);
  border-radius: 1rem;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--primary-color);
  width: ${props => props.value}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const Upload = ({ isAuthenticated }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleRemoveFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to upload resumes');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:8000/api/resumes/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      );

      toast.success(response.data.message);
      setFile(null);
      setProgress(0);
      
      // Redirect to dashboard after successful upload
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <UploadContainer>
      <PageTitle>Upload Resume</PageTitle>
      <UploadCard>
        <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <UploadIcon>
            <FaUpload />
          </UploadIcon>
          <UploadText>
            {isDragActive
              ? 'Drop the PDF file here'
              : 'Drag & drop a PDF resume, or click to select'}
          </UploadText>
          <UploadText className="text-sm">
            Supported format: PDF
          </UploadText>
        </DropzoneContainer>

        {file && (
          <FileInfo>
            <div>
              <FileName>{file.name}</FileName>
              <FileSize>{formatFileSize(file.size)}</FileSize>
            </div>
            <RemoveButton onClick={handleRemoveFile}>Remove</RemoveButton>
          </FileInfo>
        )}

        {uploading && (
          <ProgressContainer>
            <ProgressBar>
              <Progress value={progress} />
            </ProgressBar>
            <ProgressText>Uploading... {progress}%</ProgressText>
          </ProgressContainer>
        )}

        <UploadButton 
          onClick={handleUpload} 
          disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              <FaUpload /> Upload Resume
            </>
          )}
        </UploadButton>
      </UploadCard>
    </UploadContainer>
  );
};

export default Upload;