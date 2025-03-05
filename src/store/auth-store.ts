import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginCredentials, User } from '../types/auth/auth.types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUser: (user) => 
        set({ user, isAuthenticated: true, error: null }),
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        console.log('login store')
        try {
          //TODO: api mockada
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (credentials.email === 'cgl@gmail.com' && credentials.password === 'password123') {
            const user = {
              id: '1',
              email: credentials.email,
              name: 'Test User',
              role: 'user' as const,
              token: 'mock-jwt-token'
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
