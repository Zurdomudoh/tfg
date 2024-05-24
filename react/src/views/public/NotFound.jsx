import React from 'react';
import Snowfall from 'react-snowfall';
import mountainBackground from './mountain.jpg'; // Ajusta la ruta de la imagen según la ubicación en tu proyecto

export default function NotFound() {
    return (
        <div className="h-screen bg-cover flex justify-center items-center relative" style={{backgroundImage: `url(${mountainBackground})`}}>
            <h1 className="text-white text-4xl font-bold z-10">404 Page Not Found</h1>
            <Snowfall color="white" snowflakeCount={100} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0}} />
        </div>
    );
}