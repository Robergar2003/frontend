import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const ok = await login({ email, password });
    if (ok) {
      navigate('/');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <>
      <Header title="Iniciar sesión" />
      <div className="min-h-screen bg-[#fef7ed] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Entrar
          </button>
        </form>
      </div>
    </>
  );
}
