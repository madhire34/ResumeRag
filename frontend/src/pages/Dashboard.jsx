import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaFileAlt, FaSearch, FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchResumes();
  }, [navigate]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(response.data);
    } catch (error) {
      toast.error('Failed to fetch resumes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Resume deleted successfully');
      setResumes(resumes.filter(resume => resume._id !== id));
    } catch (error) {
      toast.error('Failed to delete resume');
      console.error(error);
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Your Resumes</h1>
        <ActionButtons>
          <Button onClick={() => navigate('/upload')}>Upload New Resume</Button>
          <Button secondary onClick={() => navigate('/search')}>Search Resumes</Button>
        </ActionButtons>
      </DashboardHeader>

      {loading ? (
        <LoadingMessage>Loading your resumes...</LoadingMessage>
      ) : resumes.length === 0 ? (
        <EmptyState>
          <FaFileAlt size={48} />
          <h3>No resumes found</h3>
          <p>Upload your first resume to get started</p>
          <Button onClick={() => navigate('/upload')}>Upload Resume</Button>
        </EmptyState>
      ) : (
        <ResumeGrid>
          {resumes.map(resume => (
            <ResumeCard key={resume._id}>
              <ResumeHeader>
                <h3>{resume.name || 'Unnamed Resume'}</h3>
                <DeleteButton onClick={() => handleDelete(resume._id)}>
                  <FaTrash />
                </DeleteButton>
              </ResumeHeader>
              
              <ResumeInfo>
                <InfoItem>
                  <strong>Uploaded:</strong> {new Date(resume.createdAt).toLocaleDateString()}
                </InfoItem>
                {resume.skills && (
                  <InfoItem>
                    <strong>Skills:</strong> {resume.skills.slice(0, 5).join(', ')}
                    {resume.skills.length > 5 && '...'}
                  </InfoItem>
                )}
              </ResumeInfo>
              
              <ResumeActions>
                <ActionButton onClick={() => navigate(`/search?resumeId=${resume._id}`)}>
                  <FaSearch /> Search Similar
                </ActionButton>
              </ResumeActions>
            </ResumeCard>
          ))}
        </ResumeGrid>
      )}
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  h1 {
    color: var(--color-primary);
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button`
  background: ${props => props.secondary ? 'white' : 'var(--color-primary)'};
  color: ${props => props.secondary ? 'var(--color-primary)' : 'white'};
  border: ${props => props.secondary ? '1px solid var(--color-primary)' : 'none'};
  border-radius: 6px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.secondary ? 'var(--color-primary-light)' : 'var(--color-primary-dark)'};
    color: ${props => props.secondary ? 'var(--color-primary-dark)' : 'white'};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-light);
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  
  h3 {
    margin: 1rem 0 0.5rem;
    color: var(--color-text);
  }
  
  p {
    margin-bottom: 1.5rem;
    color: var(--color-text-light);
  }
  
  svg {
    color: var(--color-primary-light);
  }
`;

const ResumeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ResumeCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ResumeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: var(--color-primary-light);
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--color-primary-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 0, 0, 0.1);
  }
`;

const ResumeInfo = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid var(--color-border);
`;

const InfoItem = styled.div`
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  strong {
    color: var(--color-text);
  }
`;

const ResumeActions = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: var(--color-primary-light);
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

export default Dashboard;