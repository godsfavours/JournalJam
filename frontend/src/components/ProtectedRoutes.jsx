// Verifies a user’s permissions and authentication status to allow access to
// certain routes.

import React, { useEffect, useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const ProtectedRoutes = ({ component: Component, setUser }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      setLoaded(false);
      try {
        const res = await axios.get('/api/current_user/');
        setUser(res.data);
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoaded(true);
      }
    };
    checkAuth();
  }, [location.pathname]);

  if (!loaded) return null;

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;