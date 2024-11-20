import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import classes from './Authentication.module.css';

export function Authentication() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Update type
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || ''; // Ensure backendUrl is defined

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        username,
        password,
      });
  
      console.log(response.data); // Log the response to inspect it
  
      const { token } = response.data;  // This should be the token returned from the backend
      if (token) {
        localStorage.setItem('token', token);  // Store the token in localStorage
        const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
        navigate(redirect);
      } else {
        setError('No token received');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed');
      } else {
        console.error('Unexpected error:', err);  // Log unexpected errors
        setError('An unexpected error occurred');
      }
    }
  };
  
  

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Text size="lg" ta="center" mt="lg">
        The QR code is intended solely for convention check-in purposes. Login is for event staff only.       
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && <Text color="red" ta="center">{error}</Text>}
        <TextInput
          label="Username"
          placeholder="Username"
          required
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Button fullWidth mt="xl" onClick={handleLogin}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
