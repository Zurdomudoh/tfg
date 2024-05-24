import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useParams } from "react-router-dom";


export default function UserDetails({gift, closeModal}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    // Llamar a la función para obtener los detalles del regalo cuando el componente se monte
    fetchDetails();
  }, []);

  const fetchDetails = () => {
    setLoading(true);
    // Realizar la solicitud para obtener los detalles del regalo con el ID proporcionado
    axiosClient
      .get(`/gifts/${gift.id}`)
      .then((response) => {
        console.log(response)
        setDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching gift details:", error);
        setLoading(false);
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <h1>Gift {details?.name} Details</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          details && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{details.name}</h5>
                <p className="card-text">Description: {details.description}</p>
                {details.detail && (
                  <div>
                    <h6 className="card-subtitle mb-2 text-muted">Imagen:</h6>
                    <img src={details.detail.thumbnail} className="card-img-top" alt="Thumbnail" />
                    <button className="btn-edit" onClick={closeModal}>Cerrar</button>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
