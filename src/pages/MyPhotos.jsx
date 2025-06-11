import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
const API = import.meta.env.VITE_API_URL;

export default function MyPhotos() {
  const { user } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`${API}/my_photos.php?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setPhotos(data))
      .catch(console.error);
  }, [user]);

  return (
    <div className="min-h-screen bg-[#fef7ed]">
      <Header title="Mis Fotos" />
      <main className="p-6">
        {photos.length === 0 ? (
          <p>No tienes fotos subidas.</p>
        ) : (
          <ul className="space-y-4">
            {photos.map(f => (
              <li key={f.id} className="bg-white p-4 rounded shadow">
                <p className="text-sm italic">
                  En la galería <strong>{f.id_galeria}</strong> tienes esta foto:
                </p>
                <img
                  src={f.url}
                  alt={f.titulo}
                  className="max-w-full max-h-60 object-contain mx-auto rounded"
                />
                <p className="font-semibold">{f.titulo}</p>
                <p className="text-sm text-gray-600">Estado: {f.estado}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
