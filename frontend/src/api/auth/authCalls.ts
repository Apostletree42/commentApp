import axiosInstance from '../config/axiosInstance';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export const AUTH_CALLS = {
  login: {
    getKey: () => ['auth', 'login'],
    call: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
  },

  register: {
    getKey: () => ['auth', 'register'],
    call: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
      return response.data;
    },
  },
};