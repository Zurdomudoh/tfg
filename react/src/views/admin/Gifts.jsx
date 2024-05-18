import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Lista de Regalos</h1>
        <Link className="btn-add" to="/admin/gifts/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Assigned User</th>
              <th>Actions</th>
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
                  <td>{getStatusLabel(gift.status)}</td> 
                  <td>{gift.gift_users.length > 0 && gift.gift_users[0].user.name}</td>
                  <td>
                    <Link className="btn-edit" to={'/admin/gifts/' + gift.id}>Edit</Link>
                    &nbsp;
                    <Link className="btn-add" to ={'/admin/gitfs/details/' +gift.id}>Detalles</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={() => onDeleteClick(gift.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
