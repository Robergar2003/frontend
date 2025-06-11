import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL; // asegúrate de tener esto en tu .env

  // Al montar, recuperamos user si estaba en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // LOGIN: llama a login.php y guarda user si success
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${apiUrl}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Error en login:', err);
      return false;
    }
  };

  // REGISTER: llama a register.php y devuelve el resultado
  const register = async ({ name, email, password }) => {
    try {
      const res = await fetch(`${apiUrl}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error('Error en register:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
