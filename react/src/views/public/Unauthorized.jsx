import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>Página no autorizada</h1>
      <Link to="/login">
        <button className='btn-edit'>Volver al login</button>
      </Link>
    </div>
  );
}
