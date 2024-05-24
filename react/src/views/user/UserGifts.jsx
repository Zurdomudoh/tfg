import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import Modal from "react-modal";
import UserGiftForm from "./UserGiftForm.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function UserGifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);

  useEffect(() => {
    getGifts();
  }, []);

  /**
   * Obtiene la lista de regalos para el usuario actual.
   * Establece el estado de carga en true antes de la solicitud y en false después de recibir la respuesta.
   * También obtiene detalles adicionales para cada regalo y los asigna.
   */
  const getGifts = () => {
    setLoading(true);
    const userId = JSON.parse(localStorage.getItem('USER')).id;
    axiosClient
      .get(`/gifts`)
      .then(({ data }) => {
        setLoading(false);
        const userGifts = data.gifts.filter(gift => gift.gift_users.some(gu => gu.user_id === userId));
        // Obtener todos los detalles de los regalos
        axiosClient.get(`/details`)
          .then(response => {
            const detailsMap = response.data.reduce((map, detail) => {
              map[detail.gift_id] = detail;
              return map;
            }, {});

            // Asignar los detalles a cada regalo
            const giftsWithDetails = userGifts.map(gift => ({
              ...gift,
              detail: detailsMap[gift.id] || null
            }));
            setGifts(giftsWithDetails);
          })
          .catch(error => {
            console.error('Ha ocurrido un error:', error);
            setGifts(userGifts);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  /**
   * Elimina un regalo por su ID después de confirmar con el usuario.
   * Envía una solicitud DELETE y actualiza el estado local para eliminar el regalo.
   * @param {number} giftId - El ID del regalo a eliminar.
   */
  const onDeleteClick = (giftId) => {
    if (!window.confirm("¿Quieres eliminar este regalo?")) {
      return;
    }
    axiosClient
      .delete(`/gifts/${giftId}`)
      .then(() => {
        setGifts(gifts.filter(gift => gift.id !== giftId));
      })
      .catch((error) => {
        console.error('Ha ocurrido un error: ', error);
      });
  };

  /**
   * Abre el modal para agregar o editar un regalo.
   * Si se proporciona un regalo, lo establece como el regalo seleccionado para editar.
   * @param {object|null} gift - El regalo para editar, o null para agregar un nuevo regalo.
   */
  const openModal = (gift = null) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  /**
   * Cierra el modal y restablece el regalo seleccionado.
   * También actualiza la lista de regalos.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGift(null);
    getGifts();
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <div className="w-3/4 m-auto ">
      <div className="flex justify-center">
        <button className="btn-add " onClick={() => openModal()}>Añadir Regalo</button>
      </div>
      <div className="mt-20 ">
        {loading && <div className="text-6xl mt-16 font-semibold text-red-700 font-mountains"><h1>Cargando...</h1></div>}
        {!loading && gifts.length === 0 && (
          <h1 className="text-6xl mt-16 font-semibold text-red-700 font-mountains text-center">Aún no tienes regalos</h1>
        )}
        <Slider {...settings}>
          {gifts.map(gift => (
            <div key={gift.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              {gift.detail && (
                <a href="#">
                  <img className="p-8 rounded-t-lg" src={gift.detail.thumbnail} alt="product image" />
                </a>
              )}
              <div className="px-5 pb-5">
                <h5 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{gift.name}</h5>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{gift.description}</span>
                </div>
              </div>
              <div className="flex justify-center items-end mt-auto space-x-4 mb-4">
                <button className="btn-edit" onClick={() => openModal(gift)}>Editar</button>
                <button className="btn-delete" onClick={() => onDeleteClick(gift.id)}>Borrar</button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Gift Form Modal"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
          <UserGiftForm gift={selectedGift} closeModal={closeModal} />
        </div>
      </Modal>
    </div>
  );
}
