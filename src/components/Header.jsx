import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ title }) {
  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-8" />
        <Link to="/" className="text-xl font-bold hover:underline">Anonymous Gallery</Link>
      </div>
      <h2 className="text-lg font-medium">{title}</h2>
    </header>
  );
}
