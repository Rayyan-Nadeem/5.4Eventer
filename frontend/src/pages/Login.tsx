import React from 'react';
import { Text } from '@mantine/core';
import { Authentication } from '../components/Authentication/Authentication';
import '../App.css';

export function Login() {
  return (
    <div className="app-container">
      <Authentication />
    </div>
  );
}
