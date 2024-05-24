import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";

export default function Details({ gift, closeModal }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = () => {
    setLoading(true);
    axiosClient
      .get(`/gifts/${gift.id}`)
      .then((response) => {
        setDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching gift details:", error);
        setLoading(false);
      });
  };

  return (
      <div className="bg-gray-900 bg-opacity-75 fixed inset-0 z-50 overflow-y-auto">
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-gradient-to-r from-white from-50% to-slate-100 to-60% rounded-lg p-6 max-w-3xl w-full">
            {loading ? (
              <p>Loading...</p>
            ) : (
              details && (
                <div className="flex">
                  <div className="w-1/2">
                    <a href={details.detail.link} target="_blank" rel="noopener noreferrer">
                      <img
                        className="p-8 rounded-t-lg"
                        src={details.detail.thumbnail}
                        alt="product image"
                      />
                    </a>
                  </div>
                  <div className="w-1/2 flex flex-col justify-between px-5 pb-5">
                    <div>
                      <a href={details.detail.link} target="_blank" rel="noopener noreferrer">
                        <h1 className="text-5xl font-semibold mt-10 tracking-tight text-gray-900 dark:text-white">
                          {details.name}
                        </h1>
                      </a>
                      <h2 className="text-2xl font-semibold mb-4 tracking-tight text-gray-900 dark:text-white">
                        {details.description}
                      </h2>
                      <h2 className="text-2xl mb-4 tracking-tight text-gray-900 dark:text-white">
                        Tienda: {details.detail.source}
                      </h2>
                      <h2 className="text-lg mb-4 tracking-tight text-gray-900 dark:text-white">
                        Gastos de envío: {details.detail.delivery}
                      </h2>
                      <h1 className="text-5xl font-semibold mt-10 tracking-tight text-gray-900 dark:text-white">
                        {details.detail.price} €
                      </h1>
                    </div>
                    <div className="flex justify-end">
                      <button className="btn-edit" onClick={closeModal}>Cerrar</button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
  );
}
