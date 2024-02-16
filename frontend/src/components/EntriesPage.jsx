import React from 'react'
import NavBar from './NavBar';

const EntriesPage = ({ user, theme, toggleTheme }) => {
  return (
    <>
      <NavBar user={user} theme={theme} toggleTheme={toggleTheme} />
      <p>Signed in as {user.username}</p>
    </>
  )
}

export default EntriesPage