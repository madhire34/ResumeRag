import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: white;
  padding: 2rem 0;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Copyright = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          © {currentYear} ResumeRAG. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;