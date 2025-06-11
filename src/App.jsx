import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Galleries from './pages/Galleries';
import GalleryView from './pages/GalleryView';
import MyPhotos from './pages/MyPhotos';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/galleries" element={<Galleries />} />
      <Route path="/gallery/:id" element={<GalleryView />} />
      <Route path="/my-photos" element={<MyPhotos />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
