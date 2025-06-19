import { getAuthToken, executeLogout } from '@/store/authStore';

export const fetchWithAuth = async (
    url: string | URL,
    options: RequestInit = {},
): Promise<Response> => {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Токен аутентификации отсутствует');
    }

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });
    
    if (res.status === 401) {
        executeLogout();
        return Promise.reject(new Error("Unauthorized")); // Остановит дальнейшую обработку
    }
    
    return res;
};