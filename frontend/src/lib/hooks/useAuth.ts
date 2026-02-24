'use client';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        const res = await fetch('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) { const data = await res.json(); setUser(data); }
        else { localStorage.removeItem('token'); }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  const isAuthenticated = !!user;

  return { user, loading, logout, isAuthenticated };
}
