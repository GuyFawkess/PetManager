import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const Login = () => {

  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  const loginForm = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;

    const userInfo = { email, password };
    loginUser(userInfo);
  }


  return (
    // HAY QUE MIRAR COMO HACER LA IMAGEN SI SOBRE PONERLA O HACERLA RESPONSIVE PERO HAY QUE MIRARLO
    <div className="h-120 flex items-center  bg-[url('/src/assets/fish_bowl.svg')] 
    bg-no-repeat bg-[length:50%] bg-[position:right_top]">
      <div className='mx-auto'>
        <form ref={loginForm} onSubmit={handleSubmit}>

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
              name="password"
              placeholder="Enter password..."
            />
          </div>

          <div className="mx-0 my-[1em]">
            <button type="submit"
              value="Login" class="rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
              <span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span class="relative">Log In</span>
            </button>
          </div>
        </form>
        <p>Don't have an account? <Link className='link link-info' to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login