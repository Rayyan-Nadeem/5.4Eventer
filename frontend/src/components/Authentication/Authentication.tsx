import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './Authentication.module.css';

// Dummy data for demonstration
const users = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'user',
    password: 'password',
    role: 'user'
  },
  {
    username: 'user2',
    password: 'password2',
    role: 'user'
  },
];

export function Authentication() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      sessionStorage.setItem('user', JSON.stringify({ username: user.username, role: user.role }));
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

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
        <Group justify="space-between" mt="lg">
        </Group>
        <Button fullWidth mt="xl" onClick={handleLogin}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
