export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
