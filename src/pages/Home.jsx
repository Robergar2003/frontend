import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-[#fef7ed] text-gray-800">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold">Anonymous Gallery</h1>
        </div>
        <nav className="space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">Iniciar sesión</Link>
              <Link to="/register" className="text-blue-600 hover:underline">Registrarse</Link>
            </>
          ) : (
            <>
              <span className="font-semibold">Hola, {user.nombre}</span>
              <Link to="/my-photos" className="text-green-600 hover:underline">Mis Fotos</Link>
              {user.rol === 'admin' && (
                <Link to="/admin" className="text-red-600 hover:underline">Panel Admin</Link>
              )}
              <button onClick={logout} className="text-sm text-gray-500 underline">Cerrar sesión</button>
            </>
          )}
        </nav>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-3xl font-bold mb-4">Bienvenido a ANONYMOUS GALLERY</h2>
        <p className="max-w-2xl mb-6">
          Esta plataforma está diseñada para que puedas subir contenido y ver cómo reaccionan los demás.
        </p>
        <Link to="/galleries" className="px-6 py-3 bg-[#ff7d1a] text-white rounded hover:bg-[#e66e14]">Explorar Galerías</Link>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 bg-white">
        © 2025 Anonymous Gallery – Proyecto DAW
      </footer>
    </div>
  );
}

export default Home;
