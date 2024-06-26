import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useNavigate, useParams } from "react-router-dom"; // Corrige la importación
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function GiftForm({ gift: initialGift, closeModal }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gift, setGift] = useState({
    id: null,
    name: '',
    description: '',
    status: 0,
    assigned_user_id: null
  });
  const [users, setUsers] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  // Se ejecuta al cargar el componente para obtener la lista de usuarios
  useEffect(() => {
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

  // Se ejecuta al recibir el regalo inicial para establecer los datos del formulario
  useEffect(() => {
    if (initialGift) {
      setGift(initialGift);
      const selectedUserId = initialGift.gift_users[0]?.user_id; // Accede al user_id del primer elemento en gift_users, si existe
      if (selectedUserId) {
        setGift(prevGift => ({ ...prevGift, assigned_user_id: selectedUserId }));
      }
    }
  }, [initialGift]);

  // Función para guardar los detalles del regalo en el servidor
  const saveGiftDetails = (detailsData, isUpdate = false) => {
    const request = isUpdate 
      ? axiosClient.put(`/details/${detailsData.id}`, detailsData)
      : axiosClient.post('/details', detailsData);

    request
      .then(() => {
        console.log('Detalles del regalo guardados');
      })
      .catch(err => {
        console.error('Error guardando los detalles: ', err);
      });
  };

  // Función que se ejecuta al enviar el formulario
  const onSubmit = ev => {
    ev.preventDefault();
    const formData = {
      name: gift.name,
      description: gift.description,
      status: gift.status,
      user_id: gift.assigned_user_id
    };

    // Función para obtener y guardar los detalles del regalo en el servidor
    const fetchAndSaveGiftDetails = (giftId, isUpdate = false) => {
      const query = formData.name + " " + formData.description;
      fetchShoppingResults(query)
        .then(shoppingData => {
          const result = shoppingData.shopping_results[0];
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
          }, 3700); // Espera 5 segundos antes de guardar los detalles del regalo
        })
        .catch(error => {
          console.error('Ha ocurrido un error introduciendo datos de compra', error);
        });
    };

    // Lógica para editar o crear un regalo
    if (gift.id) {
      axiosClient.put(`/gifts/${gift.id}`, formData)
        .then(() => {
          setNotification('Regalo modificado');
          fetchAndSaveGiftDetails(gift.id, true); // Pass true to indicate an update
          closeModal();
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post('/gifts', formData)
        .then(response => {
          setNotification('Se ha añadido un nuevo regalo');
          fetchAndSaveGiftDetails(response.data.gift.id, false); // Pass false to indicate a new record
          closeModal();
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  // Función para obtener resultados de compras desde el servidor
  const fetchShoppingResults = async (query) => {
    try {
      const response = await fetch(`http://localhost:3001/api/shopping?q=${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ha ocurrido un error: ', error);
      throw error; // Propaga el error para manejarlo más tarde
    }
  };

  return (
    <>
      {gift.id && <h1 className="text-lg mb-4">Editar regalo: {gift.name} </h1>}
      {!gift.id && <h1 className="text-lg mb-4">Nuevo Regalo: </h1>}
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
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="description"
              >
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
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="status"
              >
                Estado
              </label>
              <select
                id="status"
                className="w-full p-2 border border-gray-300 rounded"
                value={gift.status}
                onChange={(ev) => setGift({ ...gift, status: parseInt(ev.target.value) })}
              >
                <option value={0}>Pendiente</option>
                <option value={1}>Comprado</option>
                <option value={2}>Envuelto</option>
              </select>
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="assigned_user_id"
              >
                Usuario
              </label>
              <select
                id="assigned_user_id"
                className="w-full p-2 border border-gray-300 rounded"
                value={gift.assigned_user_id || ''}
                onChange={(ev) => setGift({ ...gift, assigned_user_id: ev.target.value })}
              >
                <option value="">Seleccionar Usuario</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
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
