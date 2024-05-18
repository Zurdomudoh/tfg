import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function GiftForm() {
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

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/gifts/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setGift(data);
          const selectedUser = users.find(user => user.id === data.assigned_user_id);
          if (selectedUser) {
            setSelectedUserName(selectedUser.name);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, users]);

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

  const onSubmit = ev => {
    ev.preventDefault();
    const formData = {
      name: gift.name,
      description: gift.description,
      status: gift.status,
      user_id: gift.assigned_user_id
    };

    const fetchAndSaveGiftDetails = (giftId, isUpdate = false) => {
      const query = formData.name + " " + formData.description;
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

    if (gift.id) {
      axiosClient.put(`/gifts/${gift.id}`, formData)
        .then(() => {
          setNotification('Gift was successfully updated');
          fetchAndSaveGiftDetails(gift.id, true); // Pass true to indicate an update
          navigate('/admin/gifts');
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
          setNotification('Gift was successfully created');
          fetchAndSaveGiftDetails(response.data.gift.id, false); // Pass false to indicate a new record
          navigate('/admin/gifts');
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
      {gift.id && <h1>Update Gift: {gift.name}</h1>}
      {!gift.id && <h1>New Gift</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <label>
              <legend>Regalo</legend>
              <input value={gift.name} onChange={ev => setGift({ ...gift, name: ev.target.value })} placeholder="Name" />
            </label>
            <label>
              <legend>Descripción</legend>
              <input value={gift.description} onChange={ev => setGift({ ...gift, description: ev.target.value })} placeholder="Description" />
            </label>
            <label>
              <legend>Estado</legend>
              <select value={gift.status} onChange={ev => setGift({ ...gift, status: parseInt(ev.target.value) })}>
                <option value={0}>Pendiente</option>
                <option value={1}>Comprado</option>
                <option value={2}>Envuelto</option>
              </select>
            </label>
            <label>
              <legend>Usuario</legend>
              <select value={gift.assigned_user_id || ''} onChange={ev => setGift({ ...gift, assigned_user_id: ev.target.value })}>
                <option value="">Seleccionar Usuario</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </label>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}