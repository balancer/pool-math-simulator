import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
} from 'react-router-dom';
import ReClamm from './pool-types/reclamm/ReClamm';
import StableSurge from './pool-types/stable-surge/StableSurge';
import { TimerProvider } from './contexts/TimerContext';
import styled from 'styled-components';

// Styled components for the menus
const TopNav = styled.nav`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-right: 2rem;

  img {
    height: 40px;
    width: auto;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;

  a {
    text-decoration: none;
    color: #666;
    &.active {
      color: #007bff;
      font-weight: bold;
    }
  }
`;

const CenterMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 1rem;

  a {
    padding: 1rem 2rem;
    width: 200px;
    text-align: center;
    background-color: #333;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    &:hover {
      background-color: #444;
    }
  }
`;

// Home component for the start menu
const Home = () => (
  <CenterMenu>
    <Link to='/reclamm'>ReClamm</Link>
    <Link to='/stable-surge'>Stable Surge</Link>
  </CenterMenu>
);

// Navigation component
const Navigation = () => {
  const location = useLocation();

  return (
    <TopNav>
      <Logo to='/'>
        <img src='/img/balancer.png' alt='Logo' />
      </Logo>
      <NavLinks>
        <Link
          to='/reclamm'
          className={location.pathname === '/reclamm' ? 'active' : ''}
        >
          ReClamm
        </Link>
        <Link
          to='/stable-surge'
          className={location.pathname === '/stable-surge' ? 'active' : ''}
        >
          Stable Surge
        </Link>
      </NavLinks>
    </TopNav>
  );
};

function App() {
  return (
    <TimerProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/reclamm' element={<ReClamm />} />
          <Route path='/acl-amm' element={<Navigate to='/reclamm' />} />
          <Route path='/stable-surge' element={<StableSurge />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
    </TimerProvider>
  );
}

export default App;
