import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

/**
 * Componente para el formulario de regalos del usuario.
 * Permite crear y editar regalos, así como gestionar la lógica de guardado y obtención de datos.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Object} props.gift - El regalo recibido (en caso de edición).
 * @param {Function} props.closeModal - Función para cerrar el modal.
 *
 * @returns {React.Element} El formulario para crear o editar un regalo.
 */
export default function UserGiftForm({ gift: receivedGift, closeModal }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID del regalo de los parámetros de la URL
  const [gift, setGift] = useState({
    name: '',
    description: '',
    status: 0,
    user_id: JSON.parse(localStorage.getItem('USER')).id
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  // Efecto para obtener usuarios y establecer el ID del usuario actual
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('USER'));
    if (user && user.id) {
      setGift(prevGift => ({ ...prevGift, user_id: user.id }));
    } else {
      console.error('No user found in localStorage');
    }

    setLoading(true);
    axiosClient.get('/users')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.users);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Efecto para obtener los datos del regalo si se está editando (hay un ID en la URL)
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/gifts/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setGift(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // Efecto para actualizar el regalo recibido (en caso de edición)
  useEffect(() => {
    if (receivedGift) {
      setGift(prevGift => ({
        ...prevGift,
        ...receivedGift,
        user_id: receivedGift.user_id || prevGift.user_id
      }));
    }
  }, [receivedGift, users]);

  // Función para guardar los detalles del regalo
  const saveGiftDetails = (detailsData, isUpdate = false) => {
    const request = isUpdate
      ? axiosClient.put(`/details/${detailsData.id}`, detailsData)
      : axiosClient.post('/details', detailsData);

    request
      .then(() => {
        console.log('Gift details saved successfully');
      })
      .catch(err => {
        console.error('Error saving gift details:', err);
      });
  };

  // Función para obtener y guardar los detalles del regalo desde una API externa
  const fetchAndSaveGiftDetails = (giftId, isUpdate = false) => {
    const query = gift.name + " " + gift.description;
    fetchShoppingResults(query)
      .then(shoppingData => {
        const result = shoppingData.shopping_results[0];
        console.log('Shopping data:', result);
        saveGiftDetails({
          id: giftId, // Este ID debe coincidir con el ID del detalle si se está actualizando
          gift_id: giftId,
          link: result.link,
          price: result.extracted_price,
          delivery: result.delivery,
          source: result.source,
          thumbnail: result.thumbnail
        }, isUpdate);
        setTimeout(closeModal, 3700); // Espera 3.7 segundos antes de cerrar el modal
      })
      .catch(error => {
        console.error('Error fetching shopping data:', error);
      });
  };

  // Función para manejar el envío del formulario
  const onSubmit = (ev) => {
    ev.preventDefault();
    const formData = {
      name: gift.name,
      description: gift.description,
      status: gift.status,
      user_id: gift.user_id
    };

    if (gift.id) {
      // Si es una edición, hacemos una solicitud PUT
      axiosClient.put(`/gifts/${gift.id}`, formData)
        .then(() => {
          setNotification('Gift was successfully updated');
          fetchAndSaveGiftDetails(gift.id, true); // Pasar true para indicar una actualización
          closeModal(); // Cerrar el modal después de guardar
          setTimeout(() => navigate('/user/gifts'), 3700); // Navega a UserGifts después de 3.7 segundos
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      // Si es un nuevo regalo, hacemos una solicitud POST
      axiosClient.post("/gifts", formData)
        .then(response => {
          setNotification('Gift was successfully created');
          fetchAndSaveGiftDetails(response.data.gift.id, false); // Pasar false para indicar un nuevo registro
          closeModal(); // Cerrar el modal después de guardar
          setTimeout(() => navigate('/user/gifts'), 3700); // Navega a UserGifts después de 3.7 segundos
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  // Función para obtener los resultados de compra desde una API externa
  const fetchShoppingResults = async (query) => {
    try {
      const response = await fetch(`http://localhost:3001/api/shopping?q=${query}`);
      const data = await response.json();
      console.log('Shopping results:', data);
      return data;
    } catch (error) {
      console.error('Error fetching shopping results:', error);
      throw error; // Propaga el error para manejarlo más tarde
    }
  };

  return (
    <>
      {gift.id ? <h1 className="text-lg mb-4">Editar regalo: {gift.name}</h1> : <h1 className="text-lg mb-4">Nuevo Regalo</h1>}
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
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="name">
                Regalo
              </label>
              <input
                id="name"
                className="w-full p-2 border border-gray-300 rounded"
                value={gift.name}
                onChange={(ev) => setGift({ ...gift, name: ev.target.value })}
                placeholder="Regalo"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="description">
                Descripción
              </label>
              <input
                id="description"
                className="w-full p-2 border border-gray-300 rounded"
                value={gift.description}
                onChange={(ev) => setGift({ ...gift, description: ev.target.value })}
                placeholder="Descripción"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                Guardar
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
