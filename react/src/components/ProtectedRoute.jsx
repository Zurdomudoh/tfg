import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Componente para proteger rutas basado en roles de usuario.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {React.Element} props.element - El componente a renderizar si el usuario tiene el rol adecuado.
 * @param {Array<string>} props.allowedRoles - Los roles permitidos para acceder a la ruta.
 *
 * @returns {React.Element} El componente a renderizar o una redirección a una página no autorizada.
 */
const ProtectedRoute = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("USER"));

  // Verifica si el usuario está autenticado y tiene un rol permitido
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // Renderiza el componente permitido si el usuario tiene el rol adecuado
  return element;
};

export default ProtectedRoute;
