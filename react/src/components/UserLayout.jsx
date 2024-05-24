import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client.js";

/**
 * Componente para el diseño de la interfaz de usuario autenticado.
 * 
 * Gestiona la autenticación, la obtención de datos del usuario y la interfaz general del usuario autenticado.
 *
 * @returns {React.Element} El diseño de la interfaz del usuario autenticado.
 */
const UserLayout = () => {
  const { token, setUser, setToken, notification } = useStateContext();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("USER"));
  const userName = user ? user.name : ""; 

  // Redirige a la página de login si no hay token de autenticación
  if (!token) {
    return <Navigate to="/login" />;
  }

  /**
   * Maneja la acción de cierre de sesión del usuario.
   *
   * @param {Event} ev - El evento de clic.
   */
  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      localStorage.clear();
      navigate("/"); 
    });
  };

  // Efecto para obtener datos del usuario al montar el componente
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
          <h1 className="text-6xl mt-16 font-semibold text-red-700 font-mountains">
            ¡Felices Fiestas! {userName} aquí tienes tu lista de regalos
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
