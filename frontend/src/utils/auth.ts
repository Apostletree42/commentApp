export const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
}