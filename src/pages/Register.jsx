import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const ok = await register({ name, email, password });
    if (ok) {
      navigate('/');
    } else {
      setError('Error en el registro');
    }
  };

  return (
    <>
      <Header title="Registro" />
      <div className="min-h-screen bg-[#fef7ed] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Registro</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 mb-3 border rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Registrar
          </button>
        </form>
      </div>
    </>
  );
}
