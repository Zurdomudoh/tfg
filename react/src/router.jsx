import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from '../src/components/ProtectedRoute.jsx';
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
import Details from "./views/admin/Details.jsx";
import UserDetails from "./views/user/UserDetails.jsx";
import Unauthorized from "./views/public/Unauthorized.jsx";


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
        element: <ProtectedRoute element={<Users />} allowedRoles={['admin']} />
      },
      {
        path: 'users/new', // Ruta para la vista Users dentro de AdminLayout
        element: <ProtectedRoute element={<UserForm />} allowedRoles={['admin']} />
      },
      {
        path: 'users/:id',
        element: <ProtectedRoute element={<UserForm />} allowedRoles={['admin']} />
      },
      {
        path: 'gifts', // Ruta para la vista Gifts dentro de AdminLayout
        element: <ProtectedRoute element={<Gifts />} allowedRoles={['admin']} />
      },
      {
        path: 'gifts/new', // Ruta para la vista Gifts dentro de AdminLayout
        element: <ProtectedRoute element={<GiftForm />} allowedRoles={['admin']} />
      },
      {
        path: 'gifts/:id',
        element: <ProtectedRoute element={<GiftForm />} allowedRoles={['admin']} />
      },
      {
        path: 'gifts/details/:id',
        element: <ProtectedRoute element={<Details />} allowedRoles={['admin']} />
      },
    ]
  },
  {
    path: '/user',
    element: <UserLayout/>,
    children: [
      {
        path: 'gifts', // Ruta para la vista Gifts dentro de UserLayout
        element: <ProtectedRoute element={<UserGifts />} allowedRoles={['user']} />
      },
      {
        path: 'gifts/new', // Ruta para la vista UserGiftForm dentro de UserLayout
        element: <ProtectedRoute element={<UserGiftForm />} allowedRoles={['user']} />
      },
      {
        path: 'gifts/:id', // Ruta para la vista Gifts dentro de UserLayout
        element: <ProtectedRoute element={<UserGiftForm />} allowedRoles={['user']} />
      },
      {
        path: 'gitfs/details/:id',
        element: <ProtectedRoute element={<UserDetails />} allowedRoles={['user']} />
      },
     
    ]
  },
  {
    path: "/unauthorized",
    element: <Unauthorized/>
  },

  {
    path: "*",
    element: <NotFound/>
  }
]);

export default router;
