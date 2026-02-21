/// <reference types="vite/client" />
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

function getToken(): string | null {
    return localStorage.getItem('token');
}

async function request(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '#/login';
        }
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export const api = {
    get: (endpoint: string) => request(endpoint, { method: 'GET' }),

    post: (endpoint: string, body: any) =>
        request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    put: (endpoint: string, body: any) =>
        request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),

    del: (endpoint: string) => request(endpoint, { method: 'DELETE' }),

    upload: (endpoint: string, formData: FormData, method: string = 'POST') =>
        request(endpoint, {
            method,
            body: formData,
        }),
};

export default api;
