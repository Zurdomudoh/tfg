import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.js";

export default function Details({ gift, closeModal }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (gift && gift.id) {
      fetchDetails();
    }
  }, [gift]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/gifts/${gift.id}`);
      setDetails(response.data);
    } catch (error) {
      console.error("An error occurred: ", error);
      setError("Failed to load details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 bg-opacity-75 fixed inset-0 z-50 overflow-y-auto">
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            details && (
              <div className="flex">
                <div className="w-1/2">
                  {details.detail && (
                    <a href={details.detail.link} target="_blank" rel="noopener noreferrer">
                      <img
                        className="p-8 rounded-t-lg"
                        src={details.detail.thumbnail}
                        alt="product image"
                      />
                    </a>
                  )}
                </div>
                <div className="w-1/2 flex flex-col justify-between px-5 pb-5">
                  <div>
                    {details.detail && (
                      <a href={details.detail.link} target="_blank" rel="noopener noreferrer">
                        <h1 className="text-5xl font-semibold mt-10 tracking-tight text-gray-900 dark:text-white">
                          {details.name}
                        </h1>
                      </a>
                    )}
                    <h2 className="text-2xl font-semibold mb-4 tracking-tight text-gray-900 dark:text-white">
                      {details.description}
                    </h2>
                    {details.detail && (
                      <>
                        <h2 className="text-2xl mb-4 tracking-tight text-gray-900 dark:text-white">
                          Tienda: {details.detail.source}
                        </h2>
                        <h2 className="text-lg mb-4 tracking-tight text-gray-900 dark:text-white">
                          Gastos de envío: {details.detail.delivery}
                        </h2>
                        <h1 className="text-5xl font-semibold mt-10 tracking-tight text-gray-900 dark:text-white">
                          {details.detail.price} €
                        </h1>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button className="btn-edit" onClick={closeModal}>
                      Cerrar
                    </button>
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
