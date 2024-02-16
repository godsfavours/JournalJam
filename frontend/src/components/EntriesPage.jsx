import React from 'react'
import NavBar from './NavBar';

const EntriesPage = ({ user }) => {
  return (
    <>
      <NavBar user={user} />
      <p>Signed in as {user.username}</p>
    </>
  )
}

export default EntriesPage