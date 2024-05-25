Instalación

• Requisitos mínimos del sistema:

-Composer - https://getcomposer.org/download/

-Node.js - https://nodejs.org/en/download/package-manager  

-Xammp - https://www.apachefriends.org/es/download.html 

-Git (opcional) - https://git-scm.com/downloads



• El primer paso, y más obvio es descargarse el proyecto de mi repositorio de Github.com, 
bien con el comando “git clone” o descargando el repositorio en .Zip
			
                https://github.com/Zurdomudoh/tfg.git


• Laravel:
-Duplicar el archivo “.env.example” localizado dentro del directorio api-laravel 
y renombrar la copia a “.env”. Una vez hecho esto modificar las variables de 
entorno de la base de datos para tener acceso.

-Abrir en la terminal el directorio “api-laravel”.

-Ejecutar el comando “composer update” para instalar todas las dependencias de Laravel.

-Ejecutar las migraciones con el comando “php artisan migrate –seed”. 
-Iniciar el servidor de Laravel con el comando “php artisan serve”.

• React:
-Abrir en una nueva terminal el directorio de “react”.
-Si fuese necesario, ajustar lar variables de entorno del archivo .env. o Instalar las dependencias de Node.js con el comando “npm install”. o Iniciar el servidor con el comando “npm run dev”.

• Servidor para consultas a la API Google Shopping:
-Abrir en una nueva terminal el directorio server-externo.
-Levantar el servidor con el comando “node server.js”.

• Archivo “start_app.sh” :
		-He añadido un script que permite levantar los tres servidores a la vez ejecutando el comando “./start_app.sh”, pero no funciona en cualquier S.O., para MacOs si, desde la carpeta contenedora del proyecto, y una vez instaladas todas las dependencias.
