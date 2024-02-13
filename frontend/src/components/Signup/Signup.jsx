import React from 'react'

function Signup() {
  return (
    <div className='d-flex align-items-center justify-content-center 100-w vh-100 bg-light'>
      <div className='p-3 w-25 rounded bg-white'>
        <form>
          <h4 className='mb-3'>Create an Account</h4>
          <div className='mb-2'>
            <label className='mb-1' for="username">Username</label>
            <input id='username' type='text' placeholder='Enter Username' className='form-control' required />
          </div>
          <div className='mb-2'>
            <label className='mb-1' for="email">Email</label>
            <input id='email' type='text' placeholder='Enter Email' className='form-control' />
          </div>
          <div className='mb-2'>
            <label className='mb-1' for="password">Password</label>
            <input id='password' type='password' placeholder='Enter Password' className='form-control' />
          </div>
          <div className='mb-3'>
            <label className='mb-1' for="password-confirm">Confirm Password</label>
            <input id='password-confirm' type='password' placeholder='Enter Password' className='form-control' />
          </div>
          <div className='d-grid mb-2'>
            <button className='btn btn-primary'>Sign up</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup