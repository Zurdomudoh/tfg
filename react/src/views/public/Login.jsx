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
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }

          <div className="form-field d-flex align-items-center">
            <span className="far fa-user"></span>
            <input type="text" ref={emailRef} name="userName" id="userName" placeholder="Username" />
          </div>
          <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input type="password" ref={passwordRef} name="password" id="pwd" placeholder="Password" />
          </div>
          <button className="btn btn-block">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
