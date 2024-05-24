import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import Modal from "react-modal";
import GiftForm from "./GiftForm";
import Details from "./Details";

const ITEMS_PER_PAGE = 10;

export default function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Estado para controlar la apertura/cierre del modal de detalles
  const [selectedGift, setSelectedGift] = useState(null);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getGifts();
  }, []);


  const onDeleteClick = (giftId) => {
    if (!window.confirm("¿Quieres eliminar el regalo?")) {
      return;
    }
    axiosClient
      .delete(`/gifts/${giftId}`)
      .then(() => {
        setNotification('El regalo se ha eliminado');
        getGifts(); // Refrescar la lista de regalos después de eliminar uno
      })
      .catch((error) => {
        console.error('Ha ocurrido un error:', error);
      });
  };

  const getGifts = (userId) => {
    setLoading(true);
    axiosClient
      .get(`/gifts?userId=${userId}`) // Agregar parámetro de consulta para filtrar por usuario
      .then(({ data }) => {
        setLoading(false);
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

  const openModal = (gift = null) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGift(null);
    getGifts(); // Refrescar la lista de regalos después de cerrar el modal
  };

  const openDetailsModal = (gift = null) => {
    setSelectedGift(gift);
    setIsDetailsModalOpen(true); // Establecer el estado del modal de detalles como abierto
  };
  
  // Función para cerrar el modal de detalles
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false); // Establecer el estado del modal de detalles como cerrado
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg text-slate-200 text-lg bg-slate-600">
      <div className="flex justify-between items-center m-3">
        <h1>Lista de Regalos</h1>
        <button className="btn-add" onClick={() => openModal()}>Añadir Regalo</button>
      </div>
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-lg uppercase text-slate-600">
          <tr>
            <th scope="col" className="px-6 py-3 bg-slate-300">ID</th>
            <th scope="col" className="px-6 py-3 bg-slate-300">Nombre</th>
            <th scope="col" className="px-6 py-3 bg-slate-300">Descripción</th>
            <th scope="col" className="px-6 py-3 bg-slate-300">Estado</th>
            <th scope="col" className="px-6 py-3 bg-slate-300">Usuario</th>
            <th scope="col" className="px-6 py-3 bg-slate-300">Acciones</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="6" className="text-center">Loading...</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currentGifts.map((gift, index) => (
              <tr
                key={gift.id}
                className={`text-base text-slate-800 ${index % 2 === 0 ? 'bg-slate-200 dark:bg-gray-600' : 'bg-slate-300 dark:bg-gray-800'}`}
              >
                <td className="px-6 py-4">{gift.id}</td>
                <td className="px-6 py-4">{gift.name}</td>
                <td className="px-6 py-4">{gift.description}</td>
                <td className="px-6 py-4">{getStatusLabel(gift.status)}</td>
                <td className="px-6 py-4">
                  {gift.gift_users.length > 0 && gift.gift_users[0].user.name}
                </td>
                <td className="px-6 py-4">
                  <button className="btn-edit" onClick={() => openModal(gift)}>Editar</button>
                  <button className="btn-detail" onClick={() => openDetailsModal(gift)}>Detalles</button> {/* Cambiado para abrir el modal de detalles */}                  <button className="btn-delete" onClick={() => onDeleteClick(gift.id)}>Borrar</button>
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
        contentLabel="Gift Form Modal"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
          <GiftForm gift={selectedGift} closeModal={closeModal} />
        </div>
      </Modal>
      <Modal
      isOpen={isDetailsModalOpen}
      onRequestClose={closeDetailsModal}
      contentLabel="Detalles del Regalo"
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <Details gift={selectedGift} closeModal={closeDetailsModal} /> {/* Pasar el regalo seleccionado y la función para cerrar el modal al componente Details */}
      </div>
    </Modal>
    </div>
  );
}
