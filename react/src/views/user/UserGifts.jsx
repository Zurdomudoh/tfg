import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider.jsx";

export default function UserGifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useStateContext();

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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Lista de Regalos</h1>
        <Link className="btn-add" to="/user/gifts/new">Add new</Link>

      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
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

                  <td>
                  <Link className="btn-edit" to={`/user/gifts/${gift.id}`}>Edit</Link>
                    &nbsp;
                    <Link className="btn-add" to ={'/user/gitfs/details/' +gift.id}>Detalles</Link>
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
