import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function UserGiftForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID del regalo de los parámetros de la URL
  const [gift, setGift] = useState({
    name: '',
    description: '',
    status: 0,
    user_id: JSON.parse(localStorage.getItem('USER')).id
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/gifts/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setGift(data);
          // Establecer user_id si no está definido
          if (!data.user_id) {
            setGift(prevGift => ({
              ...prevGift,
              user_id: JSON.parse(localStorage.getItem('USER')).id
            }));
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

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

    if (!id) {
      // Si es un nuevo regalo, hacemos una solicitud POST
      axiosClient.post("/gifts", formData)
        .then(response => {
          console.log('Request:', { method: 'POST', url: '/gifts', data: formData }); // Log de la solicitud
          setNotification('Gift was successfully created');
          fetchAndSaveGiftDetails(response.data.gift.id, false); // Pass false to indicate a new record
          navigate('/user/gifts');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      // Si no es nuevo, es una edición, por lo que hacemos una solicitud PUT
      axiosClient.put(`/gifts/${id}`, formData)
        .then(() => {
          console.log('Request:', { method: 'PUT', url: `/gifts/${id}`, data: formData }); // Log de la solicitud
          setNotification('Gift was successfully updated');
          fetchAndSaveGiftDetails(id, true); // Pass true to indicate an update
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

  const isNewGift = !id; // Determinar si es un nuevo regalo basado en si hay un ID

  return (
    <>
      {isNewGift ? <h1>New Gift</h1> : <h1>Update Gift: {gift.name}</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <label><legend>Regalo</legend>
              <input value={gift.name} onChange={ev => setGift({ ...gift, name: ev.target.value })} placeholder="Name" />
            </label>
            <label><legend>Descripción</legend>
              <input value={gift.description} onChange={ev => setGift({ ...gift, description: ev.target.value })} placeholder="Description" />
            </label>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
