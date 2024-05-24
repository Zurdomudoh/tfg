import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";

const UserLayout = () => {
  const { token, setUser, setToken, notification } = useStateContext();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('USER'));
  const userName = user ? user.name : ''; // Manejar el caso cuando el usuario es null

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      localStorage.clear();
      navigate("/"); // Redirigir a la página principal
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
      localStorage.setItem("USER", JSON.stringify(data));
    });
  }, []);

  return (
    <snow-fall count="400">
      <div className="min-h-screen flex flex-col bg-slate-300">
        <div className="absolute top-4 right-4">
          <button
            onClick={onLogout}
            className="text-lg bg-slate-800 text-slate-100 border border-slate-600 border-b-4 font-medium overflow-hidden px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
          >
            <span className="bg-slate-600 shadow-slate-600 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            Cerrar Sesión
          </button>
        </div>
        <div className="flex justify-center">
          <h1 className="text-6xl mt-4 font-semibold text-red-700 font-mountains">
            Felices Fiestas {userName}
          </h1>
        </div>
        <main className="flex justify-center items-center flex-grow">
          <Outlet /> {/* Renderiza las rutas anidadas */}
        </main>
        {notification && (
          <div className="notification fixed bottom-4 right-4 bg-green-600 text-slate-100 px-4 py-2 rounded">
            {notification}
          </div>
        )}
      </div>
    </snow-fall>
  );
};

export default UserLayout;
