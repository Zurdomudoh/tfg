import React, { createContext, useContext, useEffect, useState } from "react";
import router from "../router";


const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {}
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [notification, _setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  }

  const setNotification = message => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000)
  }

  useEffect(() => {
    // Realizar la llamada a la API para obtener la información del usuario y su rol
    // Supongamos que user.role contiene el rol del usuario después de cargar la información del usuario
    // Aquí simularemos un tiempo de carga con setTimeout
    setTimeout(() => {
      // Realiza la redirección según el rol del usuario
      if (user.role === "admin") {
        router.navigate("/admin/users");
      } else if (user.role === "user") {
        router.navigate("/user/gifts");
      }
      setIsLoading(false);
    }, 500); // Tiempo simulado de carga
  }, [user]);

  return (
    <StateContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        notification,
        setNotification
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);


export const onLogout = (ev) => {
  ev.preventDefault();

  axiosClient.post("/logout").then(() => {
    setUser({});
    setToken(null);
    localStorage.removeItem('USER');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.clear();
  });
};