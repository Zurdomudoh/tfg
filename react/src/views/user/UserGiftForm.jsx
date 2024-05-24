import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function UserGiftForm({ gift: receivedGift, closeModal }) {
  console.log('GIFT_RECIBIDO', receivedGift);
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

  useEffect(() => {
    if (receivedGift) {
      setGift(prevGift => ({
        ...prevGift,
        ...receivedGift,
        user_id: receivedGift.user_id || prevGift.user_id
      }));
    }
  }, [receivedGift, users]);

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

  const fetchAndSaveGiftDetails = (giftId, isUpdate = false) => {
    const query = gift.name + " " + gift.description;
    fetchShoppingResults(query)
      .then(shoppingData => {
        const result = shoppingData.shopping_results[0];
        console.log('Shopping data:', result);
        setTimeout(() => {
          saveGiftDetails({
            id: giftId, // This should match the detail ID if updating
            gift_id: giftId,
            link: result.link,
            price: result.extracted_price,
            delivery: result.delivery,
            source: result.source,
            thumbnail: result.thumbnail
          }, isUpdate);
        }, 5000); // Espera 5 segundos antes de guardar los detalles del regalo
      })
      .catch(error => {
        console.error('Error fetching shopping data:', error);
      });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const formData = {
      name: gift.name,
      description: gift.description,
      status: gift.status,
      user_id: gift.user_id
    };

    console.log('FormData:', formData); // Agregar el console.log para mostrar formData

    if (gift.id) {
      // Si es una edición, hacemos una solicitud PUT
      axiosClient.put(`/gifts/${gift.id}`, formData)
        .then(() => {
          console.log('Request:', { method: 'PUT', url: `/gifts/${gift.id}`, data: formData }); // Log de la solicitud
          setNotification('Gift was successfully updated');
          fetchAndSaveGiftDetails(gift.id, true); // Pass true to indicate an update
          closeModal(); // Cerrar el modal después de guardar
          navigate('/user/gifts');
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
          console.log('Request:', { method: 'POST', url: '/gifts', data: formData }); // Log de la solicitud
          setNotification('Gift was successfully created');
          fetchAndSaveGiftDetails(response.data.gift.id, false); // Pass false to indicate a new record
          closeModal(); // Cerrar el modal después de guardar
          navigate('/user/gifts');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

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
