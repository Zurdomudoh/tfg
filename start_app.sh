#!/bin/bash

# Inicia el servidor Node.js para el backend
echo "Iniciando servidor Node.js..."
cd backend-server
node server.js &
cd ..

# Inicia el servidor Laravel para el backend
echo "Iniciando servidor Laravel..."
cd laravel-react-starter
php artisan serve &
cd ..

# Inicia el servidor de desarrollo React para el frontend
echo "Iniciando servidor de desarrollo React..."
cd react
npm run dev
cd ..
