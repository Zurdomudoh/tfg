import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

const ITEMS_PER_PAGE = 10;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, setNotification } = useStateContext();

  useEffect(() => {
    // Obtener la información del usuario cuando se carga el componente
    getUserInfo();
  }, []);

  const getUserInfo = () => {
    axiosClient.get('/user')
      .then(({ data }) => {
        // Actualizar el contexto con la información del usuario
        setNotification('User information loaded successfully');
        getUsers(); // Llamar a getUsers después de obtener la información del usuario
      })
      .catch((error) => {
        // Manejar errores aquí si es necesario
        console.error('Error fetching user information:', error);
      });
  };

  const onDeleteClick = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient
      .delete(`/users/${userId}`)
      .then(() => {
        setNotification('User was successfully deleted');
        getUsers(); // Refrescar la lista de usuarios después de eliminar uno
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get('/users')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.users);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Paginación
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const currentUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between items-center mb-3 mt-3 ml-3 mr-3">
        <h1>Lista de Usuarios registrados</h1>
        <Link className="btn-add" to="/admin/users/new">Añadir nuevo</Link>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3">
              Correo Electrónico
            </th>
            <th scope="col" className="px-6 py-3">
              Rol
            </th>
            <th scope="col" className="px-6 py-3">
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
                className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <Link className="btn-edit" to={`/admin/users/${user.id}`}>Editar</Link>                  
                  <Link className="btn-delete" to="#" onClick={() => onDeleteClick(user.id)}>Borrar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {!loading && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            className="px-4 py-2 mb-3 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-gray-700 mb-2">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="px-4 py-2 mb-3 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
