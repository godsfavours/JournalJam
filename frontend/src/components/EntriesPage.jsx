import React from 'react'
import NavBar from './NavBar';

const EntriesPage = ({ user, toggleTheme }) => {
  return (
    <>
      <NavBar user={user} toggleTheme={toggleTheme} />
      <p>Signed in as {user.username}</p>
    </>
  )
}

export default EntriesPage