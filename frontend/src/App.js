import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound';
import ProtectedRoutes from './components/ProtectedRoutes';
import EntriesPage from './components/EntriesPage';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const App = () => {
  const [user, setUser] = useState({});
  const [toast, setToast] = useState({ show: false, header: '', body: '' });

  const onSetUser = (user) => {
    setUser(user);
  }

  const onSetToast = (toast) => {
    setToast(toast);
  }

  const renderPaths = (paths, Element) =>
    paths.map((path) => <Route key={path} path={path} element={Element} />);

  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route element={<ProtectedRoutes setUser={onSetUser} />}>
            {renderPaths(["/", "/entries"],
              <EntriesPage
                user={user}
                setToast={onSetToast}
              />)}

            {/* TODO: add routes here */}
          </Route>
        {renderPaths(["/login", "/signup"], <LandingPage />)}
          <Route path="*" element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
      <ToastContainer
        className="p-3"
        position="bottom-center"
        style={{ zIndex: 1 }}
      >
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: !toast.show })}>
          {
            toast.header &&
            <Toast.Header className='mt-1 mb-1'>
              <strong className="me-auto">{toast.header}</strong>
            </Toast.Header>}
          {
            toast.body &&
            <Toast.Body>{toast.body}</Toast.Body>
          }
        </Toast>
      </ToastContainer>
    </>


  )
}

export default App