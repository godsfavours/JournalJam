// Verifies a user’s permissions and authentication status.

import React, { useEffect, useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner';
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

  if (!loaded) {
    return (
      <div className='vh-100 d-flex justify-content-center align-items-center'>
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    )
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;