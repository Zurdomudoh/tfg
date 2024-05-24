import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import Modal from "react-modal";
import UserGiftForm from "./UserGiftForm.jsx";
import UserDetails from "./UserDetails.jsx"

export default function UserGifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Estado para controlar la apertura/cierre del modal de detalles
  const [selectedGift, setSelectedGift] = useState(null);


  useEffect(() => {
    console.log(localStorage); // Imprimir el contenido del localStorage
    getGifts();
  }, []);

  const getGifts = () => {
    setLoading(true);
    const userId = JSON.parse(localStorage.getItem('USER')).id; // Obtener el id del usuario del localStorage
    axiosClient
      .get(`/gifts`)
      .then(({ data }) => {
        setLoading(false);
        const userGifts = data.gifts.filter(gift => gift.gift_users.some(gu => gu.user_id === userId));
        setGifts(userGifts);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDeleteClick = (giftId) => {
    if (!window.confirm("Are you sure you want to delete this gift?")) {
      return;
    }
    axiosClient
      .delete(`/gifts/${giftId}`)
      .then(() => {
        setGifts(gifts.filter(gift => gift.id !== giftId)); // Eliminar el regalo de la lista
      })
      .catch((error) => {
        console.error('Error deleting gift:', error);
      });
  };

  const openModal = (gift = null) => {
    setSelectedGift(gift);
    console.log(gift)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGift(null);
    getGifts(); // Refrescar la lista de regalos después de cerrar el modal
  };

  const openDetailsModal = (gift) => {
    setSelectedGift(gift);
    setIsDetailsModalOpen(true); // Establecer el estado del modal de detalles como abierto
  };
  
  
  // Función para cerrar el modal de detalles
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false); // Establecer el estado del modal de detalles como cerrado
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Lista de Regalos</h1>
        <button className="btn-add" onClick={() => openModal()}>Añadir Regalo</button>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead className="">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th className="flex justify-center">Actions</th>
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
              {gifts.map(gift => (
                <tr key={gift.id}>
                  <td>{gift.id}</td>
                  <td>{gift.name}</td>
                  <td>{gift.description}</td>
                  <td>
                    <button className="btn-edit" onClick={() => openModal(gift)}>Editar</button>
                    <button className="btn-detail" onClick={() => openDetailsModal(gift)}>Detalles</button> {/* Cambiado para abrir el modal de detalles */}
                    <button className="btn-delete" onClick={() => onDeleteClick(gift.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Gift Form Modal"
  className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
>
  <div className="bg-white rounded-lg p-6 max-w-lg w-full">
    <UserGiftForm gift = {selectedGift} closeModal={closeModal} />
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
        <UserDetails gift={selectedGift} closeModal={closeDetailsModal} /> {/* Pasar el regalo seleccionado y la función para cerrar el modal al componente Details */}
      </div>
    </Modal>
    </div>
  );
}
