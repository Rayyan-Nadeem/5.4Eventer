import React, { useState, useEffect } from 'react';
import { Container, Button } from '@mantine/core';
import { Nav } from '../components/Nav/Nav';
import { GetQRForm } from '../components/GetQrForm/GetQrForm'; 
import { useNavigate } from 'react-router-dom';
import { FooterSocial } from '../components/Footer/Footer';
import '../App.css';

export function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by looking in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginClick = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="app-container">
      {isLoggedIn && <Nav />} {/* Show Nav if logged in */}
      <div className="content-container" style={{ padding: '50px 0px 0px 0px' }}>
        <Container my="xl">
          <GetQRForm />
          {!isLoggedIn && (
            <div className="login-button-wrapper">
              <Button onClick={handleLoginClick}>Login</Button>
            </div>
          )}
        </Container>
        {!isLoggedIn && <FooterSocial />} {/* Only show Footer if logged out */}
      </div>
    </div>
  );
}
