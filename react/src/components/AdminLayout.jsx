import React from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import axiosClient from "../axios-client.js";
import { useEffect } from "react";

const AdminLayout = () => {
  const { user, token, setUser, setToken, notification } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);

      // Limpiar información del usuario del localStorage
      localStorage.removeItem('USER');
      localStorage.removeItem('ACCESS_TOKEN');
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  return (
    <div className="flex h-screen  bg-slate-300">
      <aside className="w-64 bg-purple-700 text-white p-4 mt-1/4">
        <ul>
          <li className="block cursor-pointer p-3 hover:bg-purple-800 hover:text-gray-100 text-gray-100 text-lg m-4 rounded">
            <Link to="/admin/users">
              <i className="fa-solid fa-user fa-xl p-2 mx-2"></i>
              Usuarios
            </Link>
          </li>
          <li className="block cursor-pointer p-3 hover:bg-purple-800 hover:text-gray-100 text-gray-100 text-lg m-4 rounded">
            <Link to="/admin/gifts">
              <i className="fa-solid fa-gift fa-xl p-2 mx-2"></i>
              Regalos
            </Link>
          </li>
        </ul>
        {/* Otros enlaces específicos del admin */}
      </aside>
      <div className="flex-1">
        <header className="h-20 bg-white shadow-md flex justify-between items-center px-4">
          <div>Bienvenido: {user.name}</div>
          <div>
            <a onClick={onLogout} className="btn-logout" href="#">
              Logout
            </a>
          </div>
        </header>
        <main className="p-4">
          <Outlet /> {/* Renderiza las rutas anidadas */}
        </main>
        {notification && (
          <div className="notification fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
