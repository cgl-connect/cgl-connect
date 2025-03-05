import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginCredentials } from '@/types/auth/auth.types';
import { useAuthStore } from '@/store/auth-store';

export function useAuth() {
  const queryClient = useQueryClient();
  const { login: storeLogin, logout: storeLogout } = useAuthStore();
  
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      storeLogin({
        email: data.user.email,
        password: '', 
        remember: true
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
  
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      storeLogout();
      queryClient.clear(); 
    }
  });
  
  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
}
