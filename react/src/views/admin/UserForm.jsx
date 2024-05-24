import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function UserForm({ user: initialUser, closeModal }) {
  // Estado para almacenar los datos del usuario y los errores
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "user", // Valor predeterminado para el rol del usuario
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState(null); // Estado para manejar los errores
  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga
  const { setNotification } = useStateContext(); // Contexto para manejar las notificaciones

  // Efecto para establecer los datos iniciales del usuario cuando cambia
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  // Función para manejar el envío del formulario
  const onSubmit = (ev) => {
    ev.preventDefault(); // Evita el comportamiento predeterminado del formulario
    setLoading(true); // Establece el estado de carga a true
    const method = user.id ? "put" : "post"; // Determina si es una solicitud de actualización o creación
    const url = user.id ? `/users/${user.id}` : "/users"; // Determina la URL de la solicitud

    // Realiza la solicitud HTTP utilizando el método y la URL correspondientes
    axiosClient[method](url, user)
      .then(() => {
        setLoading(false); // Establece el estado de carga a false
        const notificationMessage = user.id
          ? "Usuario modificado satisfactoriamente"
          : "Usuario creado satisfactoriamente";
        setNotification(notificationMessage); // Establece la notificación
        closeModal(); // Cierra el modal
      })
      .catch((err) => {
        setLoading(false); // Establece el estado de carga a false
        const response = err.response; // Obtiene la respuesta de error
        if (response && response.status === 422) {
          setErrors(response.data.errors); // Establece los errores de validación
        }
      });
  };

  return (
    <>
      {user.id ? (
        <h1 className="text-lg mb-4">Editar usuario: {user.name}</h1>
      ) : (
        <h1 className="text-lg mb-4">Nuevo Usuario: </h1>
      )}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert bg-red-100 text-red-700 p-4 rounded mb-4">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Nombre
              </label>
              <input
                id="name"
                className="w-full p-2 border border-gray-300 rounded"
                value={user.name}
                onChange={(ev) => setUser({ ...user, name: ev.target.value })}
                placeholder="Nombre"
              />
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                className="w-full p-2 border border-gray-300 rounded"
                value={user.email}
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="role"
              >
                Rol
              </label>
              <select
                id="role"
                className="w-full p-2 border border-gray-300 rounded"
                value={user.role}
                onChange={(ev) => setUser({ ...user, role: ev.target.value })}
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                id="password"
                className="w-full p-2 border border-gray-300 rounded"
                type="password"
                onChange={(ev) => setUser({ ...user, password: ev.target.value })}
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="password_confirmation"
              >
                Confirmar contraseña
              </label>
              <input
                id="password_confirmation"
                className="w-full p-2 border border-gray-300 rounded"
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password_confirmation: ev.target.value })
                }
                placeholder="Confirmar contraseña"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
