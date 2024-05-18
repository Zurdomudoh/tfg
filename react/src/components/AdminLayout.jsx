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
    <div id="defaultLayout">
      <aside>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/gifts">Gifts</Link>
        {/* Otros enlaces específicos del admin */}
      </aside>
      <div className="content">
        <header>
          <div>Header Admin</div>
          <div>
            <a onClick={onLogout} className="btn-logout" href="#">
              Logout
            </a>
          </div>
        </header>
        <main>
          <Outlet /> {/* Renderiza las rutas anidadas */}
        </main>
        {notification && (
          <div className="notification">{notification}</div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
