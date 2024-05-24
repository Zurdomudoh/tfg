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
      localStorage.removeItem('USER');
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.clear();
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <nav className="bg-slate-300 shadow-lg fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center">
  <i className="fa-solid fa-crown fa-2xl -mt-1 mr-1" style={{ color: "#465468" }}></i>
  <span className="self-center text-lg font-semibold whitespace-nowrap text-slate-600 mt-1 ml-1">Bienvenido {user.name}</span>
</div>



          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button onClick={onLogout} className=" text-lg bg-slate-800 text-slate-100 border border-slate-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
  <span className="bg-slate-600 shadow-slate-600 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
  Cerrar Sesión
</button>

          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-slate-100 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-slate-300 dark:bg-gray-800 md:dark:bg-slate-300 dark:border-gray-700">
              <li>
                <Link to="/admin/users" className="block py-2 px-3 text-lg text-slate-600 rounded hover:bg-slate-600 hover:text-slate-300 md:hover:bg-transparent md:hover:text-slate-700 md:p-0 dark:text-slate-100 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition duration-300 ease-in-out transform hover:scale-105">
                  <i className="fa-solid fa-user fa-xl p-2 mx-2"></i>
                  Usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/gifts" className="block py-2 px-3 text-lg text-slate-600 rounded hover:bg-slate-600 hover:text-slate-300 md:hover:bg-transparent md:hover:text-slate-700 md:p-0 dark:text-slate-100 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition duration-300 ease-in-out transform hover:scale-105">
                  <i className="fa-solid fa-gift fa-xl p-2 mx-2"></i>
                  Regalos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="flex-1 pt-20 pl-4 pr-4"> {/* pt-20 to account for fixed nav */}
        <main className="p-4">
          <Outlet /> {/* Renderiza las rutas anidadas */}
        </main>
        {notification && (
          <div className="notification fixed bottom-4 right-4 bg-green-600 text-slate-100 px-4 py-2 rounded">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
