// frontend/src/pages/AdminPanel.jsx
import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [galleries, setGalleries] = useState([]);
  const [pending, setPending] = useState([]);
  const [newGallery, setNewGallery] = useState({
    title: '',
    description: '',
    visible: true,
    vote_days: 0,
    upload_days: 0
  });

  // Al montar, cargamos galerías y fotos pendientes si es admin
  useEffect(() => {
    if (user?.rol !== 'admin') return;
    fetch(`${API}/galleries_admin.php`)
      .then(r => r.json())
      .then(data => setGalleries(data))
      .catch(err => console.error('Error cargando galerías:', err));

    fetch(`${API}/admin_fotos.php`)
      .then(r => r.json())
      .then(data => setPending(data))
      .catch(err => console.error('Error cargando fotos pendientes:', err));
  }, [user]);

  // Crear nueva galería
  const createGallery = async () => {
    try {
      const payload = {
        titulo:      newGallery.title,       // backend espera 'titulo'
        description: newGallery.description, // backend lee 'description'
        visible:     newGallery.visible,
        vote_days:   newGallery.vote_days,
        upload_days: newGallery.upload_days
      };
      const res = await fetch(`${API}/create_gallery.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      // Refrescar listado de galerías
      const all = await fetch(`${API}/galleries_admin.php`).then(r => r.json());
      setGalleries(all);
      setNewGallery({ title: '', description: '', visible: true, vote_days: 0, upload_days: 0 });
      alert('Galería creada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al crear galería: ' + err.message);
    }
  };

  // Actualizar reglas (vote_days, upload_days)
  const handleRuleChange = (idx, field, value) => {
    const arr = [...galleries];
    arr[idx] = { ...arr[idx], [field]: value };
    setGalleries(arr);
  };

  const saveRules = async gallery => {
    try {
      const payload = {
        id:          gallery.id,
        vote_days:   gallery.vote_days,
        upload_days: gallery.upload_days
      };
      const res = await fetch(`${API}/update_gallery_rules.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!result.success) throw new Error('Error en la respuesta del servidor');
      alert('Reglas actualizadas');
    } catch (err) {
      console.error(err);
      alert('Error al guardar reglas: ' + err.message);
    }
  };

  // Borrar galería
  const deleteGallery = async id => {
    if (!window.confirm('¿Seguro que quieres borrar esta galería?')) return;
    try {
      const res = await fetch(`${API}/delete_gallery.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (!result.success) throw new Error('Error en la respuesta del servidor');
      setGalleries(galleries.filter(g => g.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al borrar galería: ' + err.message);
    }
  };

  // Alternar visibilidad
  const toggleVisibility = async (id, visible) => {
    try {
      const res = await fetch(`${API}/toggle_visibility.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, visible })
      });
      const result = await res.json();
      if (!result.success) throw new Error('Error en la respuesta del servidor');
      setGalleries(galleries.map(g => (g.id === id ? { ...g, visible } : g)));
    } catch (err) {
      console.error(err);
      alert('Error al cambiar visibilidad: ' + err.message);
    }
  };

  // Validar o rechazar foto pendiente
  const validatePhoto = async (id, estado) => {
    try {
      const res = await fetch(`${API}/validar_foto.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado })
      });
      const result = await res.json();
      if (!result.success) throw new Error('Error en la respuesta del servidor');
      setPending(pending.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al validar foto: ' + err.message);
    }
  };

  // Eliminar foto pendiente o rechazada
  const deletePhoto = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar esta foto?')) return;
    try {
      const res = await fetch(`${API}/delete_photo.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (!result.success) throw new Error('Error en la respuesta del servidor');
      setPending(pending.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar foto: ' + err.message);
    }
  };

  // Si no es admin, denegar acceso
  if (user?.rol !== 'admin') {
    return <p className="p-6">Acceso denegado</p>;
  }

  return (
    <div className="min-h-screen bg-[#fef7ed]">
      <Header title="Panel de Administración" />
      <main className="p-6 space-y-8">

        {/* === Crear Nueva Galería === */}
        <section className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="font-semibold">Crear Nueva Galería</h3>
          <input
            type="text"
            placeholder="Título"
            className="w-full p-2 border rounded"
            value={newGallery.title}
            onChange={e => setNewGallery({ ...newGallery, title: e.target.value })}
          />
          <textarea
            placeholder="Descripción"
            className="w-full p-2 border rounded"
            value={newGallery.description}
            onChange={e => setNewGallery({ ...newGallery, description: e.target.value })}
          />
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newGallery.visible}
                onChange={e => setNewGallery({ ...newGallery, visible: e.target.checked })}
              />
              <span>Visible públicamente</span>
            </label>
            <div className="w-1/4">
              <label className="block text-sm">Días para votar</label>
              <input
                type="number"
                className="w-full p-1 border rounded"
                value={newGallery.vote_days}
                onChange={e => setNewGallery({ ...newGallery, vote_days: +e.target.value })}
              />
            </div>
            <div className="w-1/4">
              <label className="block text-sm">Días para subir</label>
              <input
                type="number"
                className="w-full p-1 border rounded"
                value={newGallery.upload_days}
                onChange={e => setNewGallery({ ...newGallery, upload_days: +e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={createGallery}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </section>

        {/* === Gestión de Galerías === */}
        <section className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="font-semibold">Gestión de Galerías</h3>
          {galleries.map((g, i) => (
            <div key={g.id} className="flex items-center justify-between p-4 border-b">
              <div>
                <p className="font-semibold">{g.titulo}</p>
                <p className="text-sm text-gray-600">{g.description}</p>
                <p className="text-sm text-gray-500">
                  {g.visible ? 'Visible' : 'Oculta'} | Subida hace {g.upload_days} días, votación {g.vote_days} días
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="w-16 p-1 border rounded"
                  value={g.vote_days}
                  onChange={e => handleRuleChange(i, 'vote_days', +e.target.value)}
                />
                <input
                  type="number"
                  className="w-16 p-1 border rounded"
                  value={g.upload_days}
                  onChange={e => handleRuleChange(i, 'upload_days', +e.target.value)}
                />
                <button
                  onClick={() => saveRules(g)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Guardar días
                </button>
                <button
                  onClick={() => toggleVisibility(g.id, !g.visible)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  {g.visible ? 'Ocultar' : 'Mostrar'}
                </button>
                <button
                  onClick={() => deleteGallery(g.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* === Fotos Pendientes y Rechazadas === */}
        <section className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="font-semibold">Fotos Pendientes / Rechazadas</h3>
          {pending.length === 0 && <p className="text-gray-500">No hay fotos pendientes.</p>}
          {pending.map(f => (
            <div key={f.id} className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <img src={f.url} alt={f.titulo} className="w-20 h-20 object-cover rounded" />
                <div>
                  <p className="font-semibold">{f.titulo}</p>
                  <p className="text-sm text-gray-600">{f.descripcion}</p>
                  <p className="text-xs text-gray-500">Estado: {f.estado}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {f.estado === 'pendiente' ? (
                  <>
                    <button
                      onClick={() => validatePhoto(f.id, 'admitida')}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      ✔ Admitir
                    </button>
                    <button
                      onClick={() => validatePhoto(f.id, 'rechazada')}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      ✖ Rechazar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => deletePhoto(f.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}
