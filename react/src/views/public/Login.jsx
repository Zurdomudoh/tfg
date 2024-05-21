import { useRef, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient
      .post('/login', payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('USER', JSON.stringify(data.user));
      })
      .catch((err) => {
        console.error("Error:", err);
        const response = err.response;
        if (response) {
          if (response.status === 422) {
            setMessage(response.data.message);
          } else if (response.status === 500 && response.data.message.includes("Connection refused")) {
            setMessage("No se pudo conectar con el servidor.");
          }
        } else {
          setMessage("Error desconocido. Por favor, intenta de nuevo más tarde.");
        }
      });
  };

  return (
    <snow-fall count="400">
    <div className="min-h-screen bg-slate-300 py-6 flex flex-col justify-center sm:py-12" >
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-4xl font-semibold text-red-700 font-mountains">Queridos Reyes Magos...</h1>

            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={onSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {message && (
                  <div className="alert" style={{ color: '#f9fafb' }}>
                    <p>{message}</p>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="text"
                    ref={emailRef}
                    name="email"
                    id="email"
                    className="peer placeholder-transparent h-10 w-full border-b border-gray-300 text-gray-900 focus:outline-none focus:border-red-600"
                    placeholder="Email address"
                    
                  />
                  <label
                    htmlFor="email"
                    className="font-arsenal absolute left-2 -top-5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    ref={passwordRef}
                    name="password"
                    id="password"
                    className="peer placeholder-transparent h-10 w-full border-b border-gray-300 text-gray-900 focus:outline-none focus:border-red-600"
                    placeholder="Password"
                   
                  />
                  <label
                    htmlFor="password"
                    className="font-arsenal absolute left-2 -top-5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-6 peer-focus:text-gray-600 peer-focus:text-sm "
                  >
                    Contraseña
                  </label>
                </div>
                <div className="relative flex justify-center">
                  <button className="bg-red-700 font-mountains text-white text-2xl rounded-md w-40 px-6 py-2" >Entrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </snow-fall>
  );
  
  
};

export default Login;
