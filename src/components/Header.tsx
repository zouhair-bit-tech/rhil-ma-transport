import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  
  &:hover {
    color: #ffd700;
  }
`;

const LogoIcon = styled.div`
  background: #ffd700;
  color: #1e3c72;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? '#ffd700' : 'white'};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: ${props => props.$active ? '600' : '400'};
  
  &:hover {
    background: rgba(255,255,255,0.1);
    color: #ffd700;
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>R</LogoIcon>
          RHIL.MA
        </Logo>
        
        <Nav>
          <NavLink to="/" $active={location.pathname === '/'}>
            Accueil
          </NavLink>
          <NavLink to="/booking" $active={location.pathname === '/booking'}>
            Commander
          </NavLink>
          <NavLink to="/tracking" $active={location.pathname === '/tracking'}>
            Suivre
          </NavLink>
          <NavLink to="/admin" $active={location.pathname === '/admin'}>
            Admin
          </NavLink>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 