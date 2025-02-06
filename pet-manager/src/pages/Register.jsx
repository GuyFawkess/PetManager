import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
const Register = () => {
  const registerForm = useRef(null);
  const navigate = useNavigate();

  const {user, registerUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = registerForm.current.name.value;
    const email = registerForm.current.email.value;
    const password1 = registerForm.current.password1.value;
    const password2 = registerForm.current.password2.value;

    if (password1 !== password2) {
      alert('Passwords do not match!');
      return
    }

    const userInfo = { name, email, password1, password2 };
    registerUser(userInfo);
  }

  return (
    <div className="container">
      <div className="login-register-container">

        <form ref={registerForm} onSubmit={handleSubmit}>

          <div className="form-field-wrapper">
            <label>Name:</label>
            <input
            className='input-login-register'
              required
              type="text"
              name="name"
              placeholder="Enter name..."
            />
          </div>

          <div className="form-field-wrapper">
            <label>Email:</label>
            <input
            className='input-login-register'
              required
              type="email"
              name="email"
              placeholder="Enter email..."
            />
          </div>

          <div className="form-field-wrapper">
            <label>Password:</label>
            <input
            className='input-login-register'
              type="password"
              name="password1"
              placeholder="Enter password..."
            />
          </div>

          <div className="form-field-wrapper">
            <label>Confirm Password:</label>
            <input
            className='input-login-register'
              type="password"
              name="password2"
              placeholder="Confirm password..."
            />
          </div>


          <div className="form-field-wrapper">

            <input
              type="submit"
              value="Register"
              className="btn"
            />

          </div>

        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>

      </div>
    </div>
  )
}

export default Register