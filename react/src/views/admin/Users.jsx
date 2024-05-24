import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import UserForm from "./UserForm";
import Modal from "react-modal";

const ITEMS_PER_PAGE = 10;

export default function Users() {
  const [users, setUsers] = useState([]); // Estado para almacenar la lista de usuarios
  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la apertura/cierre del modal
  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado
  const { setNotification } = useStateContext(); // Contexto para manejar las notificaciones

  // Efecto para cargar la información de los usuarios cuando se monta el componente
  useEffect(() => {
    getUsers();
  }, []);

  // Función para obtener la lista de usuarios
  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get('/users')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.users); // Actualiza el estado con la lista de usuarios
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Función para manejar la eliminación de un usuario
  const onDeleteClick = (userId) => {
    if (!window.confirm("¿Quieres eliminar el usuario definitivamente?")) {
      return;
    }
    axiosClient
      .delete(`/users/${userId}`)
      .then(() => {
        setNotification('El usuario ha sido eliminado');
        getUsers(); // Actualiza la lista de usuarios después de eliminar uno
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error);
      });
  };

  // Paginación
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const currentUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Función para abrir el modal de usuario (para agregar o editar)
  const openModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    getUsers(); // Actualiza la lista de usuarios después de cerrar el modal
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg text-slate-200 text-lg bg-slate-600">
      <div className="flex justify-between items-center m-3">
        <h1>Lista de Usuarios registrados</h1>
        <button className="btn-add" onClick={() => openModal()}>Añadir Usuario</button>
      </div>
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-lg uppercase text-slate-600">
          <tr>
            <th scope="col" className="px-6 py-3 bg-slate-300">
              ID
            </th>
            <th scope="col" className="px-6 py-3 bg-slate-300">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 bg-slate-300">
              Correo Electrónico
            </th>
            <th scope="col" className="px-6 py-3 bg-slate-300">
              Rol
            </th>
            <th scope="col" className="px-6 py-3 bg-slate-300">
              Acciones
            </th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`text-base text-slate-800 ${index % 2 === 0 ? 'bg-slate-200 dark:bg-gray-600' : 'bg-slate-300 dark:bg-gray-800'}`}
              >
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <button className="btn-edit" onClick={() => openModal(user)}>Editar</button>
                  <button className="btn-delete" onClick={() => onDeleteClick(user.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {!loading && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            className="px-4 py-2 mb-3 bg-slate-300 text-gray-700 rounded transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-md"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-slate-100 mb-2">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="px-4 py-2 mb-3 bg-slate-300 text-gray-700 rounded transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-md"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="User Form Modal"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
          <UserForm user={selectedUser} closeModal={closeModal} />
        </div>
      </Modal>

    
    </div>
  );
}
