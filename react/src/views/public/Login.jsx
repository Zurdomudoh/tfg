import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    console.log("Payload:", payload);

    axiosClient
      .post('/login', payload)
      .then(({ data }) => {
        console.log("User data:", data.user);
        console.log("Token:", data.token);
        setUser(data.user);
        setToken(data.token);

        localStorage.setItem('USER', JSON.stringify(data.user));

        // Redirige a la ruta adecuada después del inicio de sesión
        if (data.user.role === "admin") {
          navigate("/admin/users");
        } else if (data.user.role === "user") {
          navigate(`/user/gifts`);
        }
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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Login into your account</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={onSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {message && (
                  <div className="alert">
                    <p>{message}</p>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="text"
                    ref={emailRef}
                    name="email"
                    id="email"
                    className="peer placeholder-transparent h-10 w-full border-b border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-2 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                   Email Address
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    ref={passwordRef}
                    name="password"
                    id="password"
                    className="peer placeholder-transparent h-10 w-full border-b border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-2 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <button className="bg-cyan-500 text-white rounded-md px-2 py-1">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
