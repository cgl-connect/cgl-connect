import axios from 'axios';
import { AuthResponse, LoginCredentials } from '../types/auth/auth.types';
import { ApiResponse } from '../types/api/api.types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


// TODO: service mocada, substituir pelo serviço real

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
      return {
        user: {
          id: '1',
          email: credentials.email,
          name: 'Test User',
          role: 'user',
          token: 'mock-jwt-token',
        },
        token: 'mock-jwt-token',
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};
