Instalación
• Requisitos mínimos del sistema:
o Composer - https://getcomposer.org/download/
o Node.js - https://nodejs.org/en/download/package-manager o Xammp - https://www.apachefriends.org/es/download.html o Git (opcional) - https://git-scm.com/downloads
• El primer paso, y más obvio es descargarse el proyecto de mi repositorio de Github.com, bien con el comando “git clone” o descargando el repositorio en .Zip
https://github.com/Zurdomudoh/tfg.git
• Laravel:
o Duplicar el archivo “.env.example” localizado dentro del directorio api- Laravel y renombrar la copia a “.env”. Una vez hecho esto modificar las variables de entorno de la base de datos para tener acceso.
o Abrir en la terminal el directorio “api-laravel”.
o Ejecutar el comando “composer update” para instalar todas las dependencias
de Laravel.
o Ejecutar las migraciones con el comando “php artisan migrate –seed”. o Iniciar el servidor de Laravel con el comando “php artisan serve”.
• React:
o Abrir en una nueva terminal el directorio de “react”.
o Si fuese necesario, ajustar lar variables de entorno del archivo .env. o Instalar las dependencias de Node.js con el comando “npm install”. o Iniciar el servidor con el comando “npm run dev”.
• Servidor para consultas a la API Google Shopping:
o Abrir en una nueva terminal el directorio server-externo.
o Levantar el servidor con el comando “node server.js”.
• Archivo “start_app.sh” :
o He añadido un script que permite levantar los tres servidores a la vez ejecutando el comando “./start_app.sh”, pero no funciona en cualquier S.O., para MacOs si, desde la carpeta contenedora del proyecto, y una vez instaladas todas las dependencias.