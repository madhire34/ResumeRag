import { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaSearch, FaSpinner } from 'react-icons/fa';

const SearchContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const SearchCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const SearchButton = styled.button`
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

  &:hover {
    background-color: var(--primary-hover);
  }

  &:disabled {
    background-color: var(--text-light);
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
`;

const ResultCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-color);
`;

const ResultTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const ResultContent = styled.div`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-line;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SkillTag = styled.span`
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: var(--primary-color);
  font-size: 2rem;
`;

const Search = ({ isAuthenticated }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    if (!isAuthenticated) {
      toast.error('Please login to search resumes');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:8000/api/resumes/search',
        { query: query.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.error || 'Failed to search resumes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContainer>
      <PageTitle>Search Resumes</PageTitle>
      
      <SearchCard>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Enter job requirements or skills (e.g., 'Experienced React developer with AWS knowledge')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchButton type="submit" disabled={loading}>
            {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            {loading ? 'Searching...' : 'Search'}
          </SearchButton>
        </SearchForm>
      </SearchCard>

      {loading && (
        <LoadingSpinner>
          <FaSpinner className="animate-spin" />
        </LoadingSpinner>
      )}

      {results && (
        <ResultsContainer>
          {results.summary && (
            <ResultCard>
              <ResultTitle>AI Analysis</ResultTitle>
              <ResultContent>{results.summary}</ResultContent>
            </ResultCard>
          )}

          {results.matches && results.matches.length > 0 ? (
            results.matches.map((match, index) => (
              <ResultCard key={index}>
                <ResultTitle>{match.name || `Resume ${index + 1}`}</ResultTitle>
                {match.skills && match.skills.length > 0 && (
                  <SkillTags>
                    {match.skills.map((skill, i) => (
                      <SkillTag key={i}>{skill}</SkillTag>
                    ))}
                  </SkillTags>
                )}
                {match.excerpt && (
                  <ResultContent>
                    <strong>Relevant excerpt:</strong>
                    <br />
                    {match.excerpt}
                  </ResultContent>
                )}
              </ResultCard>
            ))
          ) : (
            <NoResults>
              <p>No matching resumes found. Try a different search query.</p>
            </NoResults>
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

export default Search;