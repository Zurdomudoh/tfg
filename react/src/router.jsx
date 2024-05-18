import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/public/Login.jsx";
import NotFound from "./views/public/NotFound.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import UserLayout from "./components/UserLayout.jsx";
import Users from "./views/admin/Users";
import UserForm from "./views/admin/UserForm.jsx";
import Gifts from "./views/admin/Gifts.jsx";
import GiftForm from "./views/admin/GiftForm.jsx";
import UserGifts from "./views/user/UserGifts.jsx";
import UserGiftForm from "./views/user/UserGiftForm.jsx";
import Details from "./views/admin/Details.jsx"
import UserDetails from "./views/user/UserDetails.jsx";

const router = createBrowserRouter([
  {
    path: '/', // Página principal
    element: <Navigate to="/login" />, // Redirigir al usuario al login
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin', // Rutas para el rol de administrador
    element: <AdminLayout/>,
    children: [
      {
        path: 'users', // Ruta para la vista Users dentro de AdminLayout
        element: <Users />
      },
      {
        path: 'users/new', // Ruta para la vista Users dentro de AdminLayout
        element: <UserForm />
      },
      {
        path: 'users/:id',
        element: <UserForm/>
      },
      {
        path: 'gifts', // Ruta para la vista Gifts dentro de AdminLayout
        element: <Gifts />
      },
      {
        path: 'gifts/new', // Ruta para la vista Gifts dentro de AdminLayout
        element: <GiftForm />
      },
      {
        path: 'gifts/:id',
        element: <GiftForm/>
      },
      {
        path: 'gitfs/details/:id',
        element: <Details/>
      },
    ]
  },
  {
    path: '/user',
    element: <UserLayout/>,
    children: [
      {
        path: 'gifts', // Ruta para la vista Gifts dentro de UserLayout
        element: <UserGifts />
      },
      {
        path: 'gifts/new', // Ruta para la vista UserGiftForm dentro de UserLayout
        element: <UserGiftForm />
      },
      
      {
        path: 'gifts/:id', // Ruta para la vista Gifts dentro de UserLayout
        element: <UserGiftForm/>
      },
      {
        path: 'gitfs/details/:id',
        element: <UserDetails/>
      },
      // Otras rutas para el rol de usuario...
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
]);

export default router;
