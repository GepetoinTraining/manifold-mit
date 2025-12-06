'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
    const [cert, setCert] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedCert = localStorage.getItem('manifold_cert');
        if (savedCert) setCert(savedCert);
        setLoading(false);
    }, []);

    async function login(email: string, password: string) {
        const geo = await getGeo();

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, geo })
        });

        const data = await res.json();

        if (data.error || data.status === 'FAIL') {
            throw new Error(data.error || data.reason || 'Login failed');
        }

        localStorage.setItem('manifold_cert', data.cert);
        setCert(data.cert);
        return data;
    }

    async function register(email: string, password: string) {
        const geo = await getGeo();

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, geo })
        });

        const data = await res.json();

        if (data.error || data.status !== 'SUCCESS') {
            throw new Error(data.error || 'Registration failed');
        }

        return data;
    }

    function logout() {
        localStorage.removeItem('manifold_cert');
        setCert(null);
    }

    async function getGeo(): Promise<{ lat: number; lng: number }> {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => resolve({ lat: 0, lng: 0 })
            );
        });
    }

    return {
        cert,
        isAuthenticated: !!cert,
        loading,
        login,
        register,
        logout
    };
}