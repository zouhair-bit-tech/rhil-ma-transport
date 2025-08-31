import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #1a1a1a;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; 2024 RHIL.MA - Transport de Bagages par Triporteur</p>
        <p>Service disponible dans tout le Maroc</p>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 