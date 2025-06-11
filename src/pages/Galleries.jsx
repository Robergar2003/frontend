import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
const API = import.meta.env.VITE_API_URL;

export default function Galleries() {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    fetch(`${API}/galleries.php`)
      .then(res => res.json())
      .then(setGalleries)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#fef7ed]">
      <Header title="Galerías Disponibles" />
      <main className="p-6">
        <ul className="space-y-4">
          {galleries.map(g => (
            <li key={g.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{g.titulo}</h3>
              <p className="text-sm text-gray-600 mb-2">{g.descripcion}</p>
              <p className="text-xs mb-2">
                Votos: {g.vote_days}d · Subidas: {g.upload_days}d
              </p>
              <Link
                to={`/gallery/${g.id}`}
                className="text-blue-600 hover:underline"
              >
                Ver galería
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
