import React from 'react'
import './Login.css'

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='d-flex align-items-center justify-content-center 100-w vh-100 bg-light'>
        <div className='p-3 w-25 rounded bg-white'>
          <form>
            <h4 className='mb-3'>Sign into Journal Jam</h4>
            <div className='mb-2'>
              <label className='mb-1' for="username">Username</label>
              <input id='username' type='text' placeholder='Enter Username' className='form-control' />
            </div>
            <div className='mb-2'>
              <label className='mb-1' for="password">Password</label>
              <input id='password' type='password' placeholder='Enter Password' className='form-control' />
            </div>
            <div className='mb-3'>
              <input type="checkbox" className='custom-control custom-checkbox' id='check' />
              <label htmlFor="check" className='custom-input-label ms-2'>Remember me</label>
            </div>
            <div className='d-grid mb-2'>
              <button className='btn btn-primary'>Sign in</button>
            </div>
            <p className='text-center'><a href="">Create an account</a></p>
            <p className='text-center'>Forgot your <a href="">Password?</a></p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login