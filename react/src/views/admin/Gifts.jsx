import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

const ITEMS_PER_PAGE = 10;

export default function Gifts() {
  const [gifts, setGifts] = useState([]);
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
        setNotification('Gifts information loaded successfully');
        getGifts(data.id); // Pasar el ID del usuario para filtrar los regalos
      })
      .catch((error) => {
        // Manejar errores aquí si es necesario
        console.error('Error fetching user information:', error);
      });
  };

  const onDeleteClick = (giftId) => {
    if (!window.confirm("Are you sure you want to delete this gift?")) {
      return;
    }
    axiosClient
      .delete(`/gifts/${giftId}`)
      .then(() => {
        setNotification('Gift was successfully deleted');
        getGifts(user.id); // Pasar el ID del usuario para refrescar los regalos
      })
      .catch((error) => {
        console.error('Error deleting gift:', error);
      });
  };

  const getGifts = (userId) => {
    setLoading(true);
    axiosClient
      .get(`/gifts?userId=${userId}`) // Agregar parámetro de consulta para filtrar por usuario
      .then(({ data }) => {
        setLoading(false);
        console.log(data)
        setGifts(data.gifts);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Pendiente";
      case 1:
        return "Comprado";
      case 2:
        return "Envuelto";
      default:
        return "Desconocido";
    }
  };

  // Paginación
  const totalPages = Math.ceil(gifts.length / ITEMS_PER_PAGE);
  const currentGifts = gifts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between items-center mb-3">
      <h1>Lista de Regalos</h1>
      <Link className="btn-add" to="/admin/gifts/new">Add new</Link>
    </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Regalo
            </th>
            <th scope="col" className="px-6 py-3">
              Descripción
            </th>
            <th scope="col" className="px-6 py-3">
              Estado
            </th>
            <th scope="col" className="px-6 py-3">
              Remitente
            </th>
            <th scope="col" className="px-6 py-3">
              Opciones
            </th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="6" className="text-center">
                Loading...
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currentGifts.map((gift, index) => (
              <tr
                key={gift.id}
                className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {gift.name}
                </th>
                <td className="px-6 py-4">{gift.description}</td>
                <td className="px-6 py-4">{getStatusLabel(gift.status)}</td>
                <td className="px-6 py-4">
                  {gift.gift_users.length > 0 && gift.gift_users[0].user.name}
                </td>
                <td className="px-6 py-4">
                  <Link className="btn-edit" to={'/admin/gifts/' + gift.id}>Editar</Link>                  
                  <Link className="btn-add" to ={'/admin/gifts/details/' +gift.id}>Detalles</Link>
                  <Link className="btn-delete" to="#" onClick={() => onDeleteClick(gift.id)}>Borrar</Link>
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
            Previous
          </button>
          <span className="text-gray-700 mb-2">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="px-4 py-2 mb-3 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
