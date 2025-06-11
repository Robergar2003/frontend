import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
const API = import.meta.env.VITE_API_URL;

export default function GalleryView() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDesc, setPhotoDesc] = useState('');
  const [message, setMessage] = useState('');
  const [canUpload, setCanUpload] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch(`${API}/gallery_view.php?id=${id}`);
        const data = await res.json();
        setTitle(data.titulo || '');
        setPhotos(data.fotos || []);

        if (user && Array.isArray(data.fotos)) {
          const already = data.fotos.some(f => f.id_usuario === user.id);
          setCanUpload(!already);
        } else {
          setCanUpload(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadGallery();
  }, [id, user]);

  const vote = async (photoId, tipo) => {
    try {
      const res = await fetch(`${API}/votar.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_foto: photoId, tipo })
      });
      const result = await res.json();
      setMessage(result.message);

      const r2 = await fetch(`${API}/gallery_view.php?id=${id}`);
      const d2 = await r2.json();
      setPhotos(d2.fotos || []);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadPhoto = async e => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch(`${API}/subir_foto.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user.id,
          id_galeria: id,
          url,
          titulo: photoTitle,
          descripcion: photoDesc
        })
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      setMessage(result.message);
      setCanUpload(false);
      setUrl('');
      setPhotoTitle('');
      setPhotoDesc('');

      const r2 = await fetch(`${API}/gallery_view.php?id=${id}`);
      const d2 = await r2.json();
      setPhotos(d2.fotos || []);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fef7ed]">
      <Header title={title} />
      <main className="p-6 space-y-6">
        {user && canUpload && (
          <form
            onSubmit={uploadPhoto}
            className="bg-white p-4 rounded shadow space-y-3"
          >
            <input
              type="url"
              placeholder="URL de tu foto"
              className="w-full p-2 border rounded"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Título de la foto"
              className="w-full p-2 border rounded"
              value={photoTitle}
              onChange={e => setPhotoTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Descripción de la foto"
              className="w-full p-2 border rounded"
              value={photoDesc}
              onChange={e => setPhotoDesc(e.target.value)}
              required
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Subir Foto
            </button>
            {message && (
              <p className="mt-2 text-sm text-red-600">{message}</p>
            )}
          </form>
        )}

        {user && !canUpload && (
          <p className="text-center text-gray-600">
            Ya has subido tu foto a esta galería.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {photos.map(p => (
            <div
              key={p.id}
              className="bg-white p-4 rounded shadow flex flex-col"
            >
              <img
                src={p.url}
                alt={p.titulo}
                className="w-full h-48 object-contain mb-2 rounded"
              />
              <h4 className="font-semibold">{p.titulo}</h4>
              <p className="text-sm text-gray-600 mb-2">{p.descripcion}</p>
              <p className="mt-1 text-xs text-gray-500">
                👍 {p.positive_votes || 0}   👎 {p.negative_votes || 0}
              </p>
              <div className="mt-auto flex justify-between">
                <button
                  onClick={() => vote(p.id, 'positivo')}
                  className="text-green-600 text-xl"
                >
                  👍
                </button>
                <button
                  onClick={() => vote(p.id, 'negativo')}
                  className="text-red-600 text-xl"
                >
                  👎
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
