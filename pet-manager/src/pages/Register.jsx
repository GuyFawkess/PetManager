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
    <div className="max-w-10/12 m-auto p-[2rem]">
      <div className="max-w-[600px] m-auto">

        <form ref={registerForm} onSubmit={handleSubmit}>

          <div className="mx-0 my-[1em]">
            <label>Name:</label>
            <input
            className="bg-white border border-black p-4 w-full text-black outline-none"
              required
              type="text"
              name="name"
              placeholder="Enter name..."
            />
          </div>

          <div className="mx-0 my-[1em]">
            <label>Email:</label>
            <input
            className="bg-white border border-black p-4 w-full text-black outline-none"
              required
              type="email"
              name="email"
              placeholder="Enter email..."
            />
          </div>

          <div className="mx-0 my-[1em]">
            <label>Password:</label>
            <input
            className="bg-white border border-black p-4 w-full text-black outline-none"
              type="password"
              name="password1"
              placeholder="Enter password..."
            />
          </div>

          <div className="mx-0 my-[1em]">
            <label>Confirm Password:</label>
            <input
            className="bg-white border border-black p-4 w-full text-black outline-none"
              type="password"
              name="password2"
              placeholder="Confirm password..."
            />
          </div>


          <div className="mx-0 my-[1em]">
          <button type="submit"
              value="Login" class="relative rounded px-5 py-2.5 overflow-hidden group bg-blue-500 relative hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all ease-out duration-300">
              <span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span class="relative">Register</span>
            </button>
          </div>

        </form>

        <p>Already have an account? <Link className='link link-success' to="/login">Login</Link></p>

      </div>
    </div>
  )
}

export default Register