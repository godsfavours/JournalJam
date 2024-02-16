import React, { useEffect } from 'react'
import NavBar from './NavBar';

const EntriesPage = ({ user, setToast }) => {
  return (
    <>
      <NavBar user={user} setToast={setToast} />
    </>
  )
}

export default EntriesPage