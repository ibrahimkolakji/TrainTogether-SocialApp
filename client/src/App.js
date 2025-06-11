import Login from './pages/login/login';
import Register from './pages/register/register';
import { AuthContext } from './context/authContext';
import React, { useState, useContext } from 'react';
import LeftBar from './components/leftBar/leftBar';
import Navbar from './components/navbar/Navbar';
import RightBar from './components/rightBar/rightBar';
import Home from './pages/home/home';
import Profile from './pages/profile/profile';
import Friends from './pages/friends/friends';
import Notifications from './pages/notification/notification';
import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

function App() {
  const { currentUser } = useContext(AuthContext);
  const queryClient = new QueryClient();
  const Layout = () =>{
    return(
      <QueryClientProvider client={queryClient}>
      <div>
        <Navbar />
        <div style={{display:"flex"}}>
          <LeftBar />
          <div style={{flex:6}}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({children}) => {
    if(!currentUser){
      return <Navigate to="/login"/>
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,             // Zeigt Home als Default-Route für "/"
          element: <Home />
        },
        {
          path: 'home',
          element: <Home />
        },
        {
          path: 'profile/:id',
          element: <Profile />
        },
        {
          path: 'friends',
          element: <Friends />
        },
        {
          path: 'notifications',
          element: <Notifications />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}


export default App;