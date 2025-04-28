import { useMutation } from '@tanstack/react-query';
import { AUTH_CALLS, LoginCredentials, RegisterCredentials, AuthResponse } from './authCalls';

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationKey: AUTH_CALLS.login.getKey(),
    mutationFn: (credentials) => AUTH_CALLS.login.call(credentials),
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
    },
  });
};

export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationKey: AUTH_CALLS.register.getKey(),
    mutationFn: (credentials) => AUTH_CALLS.register.call(credentials),
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
    },
  });
};